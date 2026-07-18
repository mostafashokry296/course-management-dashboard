import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Course } from '../../models/course.model';
import { CoursesService } from '../../services/courses.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import {
  DataTableAction,
  DataTableColumn,
  DataTableComponent,
} from '../../../../shared/components/data-table/data-table';
import { TranslatedMatPaginatorIntl } from '../../../../core/services/translated-paginator-intl.service';

type SortOption =
  | 'nameAsc'
  | 'nameDesc'
  | 'priceAsc'
  | 'priceDesc'
  | 'dateNewest'
  | 'dateOldest';

type ViewMode = 'cards' | 'table';

@Component({
  selector: 'app-courses-list',
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    ConfirmDialog,
    DataTableComponent,
    MatPaginatorModule,
  ],
  standalone: true,
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: TranslatedMatPaginatorIntl }],
})
export class CoursesListComponent implements OnInit {
  private readonly courses = signal<Course[]>([]);
  readonly filteredCourses = signal<Course[]>([]);
  readonly pagedCourses = signal<Course[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly viewMode = signal<ViewMode>('table');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(8);
  readonly showDeleteDialog = signal(false);

  searchTerm = '';
  statusFilter = '';
  sortBy: SortOption = 'dateNewest';
  pageSizeOptions = [4, 8, 12, 24];

  coursePendingDelete: number | null = null;
  tableColumns: DataTableColumn<Course>[] = [];
  tableActions: DataTableAction<Course>[] = [];

  private toastService = inject(ToastService);
  translationService = inject(TranslationService);

  constructor(
    private coursesService: CoursesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.setupTable();
    this.fetchCourses();
  }

  private setupTable(): void {
    this.tableColumns = [
      {
        key: 'courseName',
        headerKey: 'coursesList.colName',
        cellClass: 'course-name-cell',
      },
      { key: 'instructorName', headerKey: 'coursesList.colInstructor' },
      { key: 'category', headerKey: 'coursesList.colCategory' },
      {
        key: 'duration',
        headerKey: 'coursesList.colDuration',
        valueFn: (row) =>
          `${row.duration} ${this.translationService.translate('common.hours')}`,
      },
      {
        key: 'price',
        headerKey: 'coursesList.colPrice',
        valueFn: (row) =>
          `${row.price} ${this.translationService.translate('common.currency')}`,
      },
      {
        key: 'status',
        headerKey: 'coursesList.colStatus',
        cellType: 'badge',
        valueFn: (row) => this.translationService.translate(`courseStatus.${row.status}`),
        badgeClassFn: (row) => this.getStatusBadgeClass(row.status),
      },
      { key: 'createdDate', headerKey: 'coursesList.colCreated' },
    ];

    this.tableActions = [
      {
        labelKey: 'common.view',
        icon: 'fa-solid fa-eye',
        buttonClass: 'action-view',
        onClick: (row) => this.goToDetails(row.id!),
      },
      {
        labelKey: 'common.edit',
        icon: 'fa-solid fa-pen',
        buttonClass: 'action-edit',
        onClick: (row) => this.goToEdit(row.id!),
      },
      {
        labelKey: 'common.delete',
        icon: 'fa-solid fa-trash',
        buttonClass: 'action-delete',
        onClick: (row) => this.openDeleteDialog(row.id!),
      },
    ];
  }

  getStatusBadgeClass(status: Course['status']): string {
    const map: Record<Course['status'], string> = {
      Active: 'status-active',
      Draft: 'status-draft',
      Archived: 'status-archived',
    };
    return map[status] ?? 'status-default';
  }

  fetchCourses(): void {
    this.loading.set(true);
    this.error.set('');
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.translationService.translate('common.loadError'));
        this.loading.set(false);
      },
    });
  }

  applyFilters(): void {
    let result = this.courses().filter(
      (c) =>
        c.courseName.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.statusFilter ? c.status === this.statusFilter : true),
    );

    result = this.sortCourses(result);
    this.filteredCourses.set(result);
    this.pageIndex.set(0);
    this.updatePagedCourses();
  }

  private sortCourses(list: Course[]): Course[] {
    const sorted = [...list];
    switch (this.sortBy) {
      case 'nameAsc':
        return sorted.sort((a, b) => a.courseName.localeCompare(b.courseName));
      case 'nameDesc':
        return sorted.sort((a, b) => b.courseName.localeCompare(a.courseName));
      case 'priceAsc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'dateOldest':
        return sorted.sort(
          (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
        );
      case 'dateNewest':
      default:
        return sorted.sort(
          (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
        );
    }
  }

  updatePagedCourses(): void {
    const start = this.pageIndex() * this.pageSize();
    this.pagedCourses.set(this.filteredCourses().slice(start, start + this.pageSize()));
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.updatePagedCourses();
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  goToAdd(): void {
    this.router.navigate(['/courses/add']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/courses/edit', id]);
  }

  goToDetails(id: number): void {
    this.router.navigate(['/courses/details', id]);
  }

  openDeleteDialog(id: number): void {
    this.coursePendingDelete = id;
    this.showDeleteDialog.set(true);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.coursePendingDelete = null;
  }

  confirmDelete(): void {
    if (this.coursePendingDelete == null) return;

    const id = this.coursePendingDelete;
    this.showDeleteDialog.set(false);
    this.coursePendingDelete = null;

    this.coursesService.deleteCourse(id).subscribe({
      next: () => {
        this.toastService.success(this.translationService.translate('common.deleteSuccess'));
        this.fetchCourses();
      },
      error: () => {
        this.toastService.error(this.translationService.translate('common.deleteError'));
      },
    });
  }
}
