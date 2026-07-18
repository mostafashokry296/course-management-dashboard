import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CoursesService } from '../../services/courses.service';
import { Course, CourseStatus } from '../../models/course.model';
import { ToastService } from '../../../../core/services/toast.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { CanComponentDeactivate } from '../../../../core/guards/can-component-deactivate';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss',
})
export class CourseForm implements OnInit, CanComponentDeactivate {
  form!: FormGroup;
  isEditMode = signal(false);
  courseId?: number;
  loading = signal(false);
  submitting = signal(false);

  readonly statusOptions: CourseStatus[] = ['Active', 'Draft', 'Archived'];

  private allowNavigation = false;
  private originalCreatedDate = '';
  private toastService = inject(ToastService);
  translationService = inject(TranslationService);

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      instructorName: ['', Validators.required],
      category: ['', Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      description: ['', Validators.maxLength(500)],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.isEditMode.set(true);
    this.courseId = +id;

    const resolved = this.route.snapshot.data['course'] as Course | null | undefined;
    if (resolved) {
      this.originalCreatedDate = resolved.createdDate;
      this.form.patchValue(resolved);
      return;
    }

    this.loading.set(true);
    this.coursesService.getCourseById(this.courseId).subscribe({
      next: (course: Course) => {
        this.originalCreatedDate = course.createdDate;
        this.form.patchValue(course);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error(this.translationService.translate('courseForm.loadError'));
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.form.value as Omit<Course, 'id' | 'createdDate'>;
    const courseData: Omit<Course, 'id'> = {
      ...formValue,
      createdDate: this.isEditMode()
        ? this.originalCreatedDate
        : new Date().toISOString().split('T')[0],
    };

    if (this.isEditMode() && this.courseId) {
      this.coursesService.updateCourse(this.courseId, courseData as Course).subscribe({
        next: () => {
          this.allowNavigation = true;
          this.toastService.success(this.translationService.translate('courseForm.updateSuccess'));
          this.router.navigate(['/courses']);
        },
        error: () => {
          this.submitting.set(false);
          this.toastService.error(this.translationService.translate('courseForm.updateError'));
        },
      });
    } else {
      this.coursesService.addCourse(courseData as Course).subscribe({
        next: () => {
          this.allowNavigation = true;
          this.toastService.success(this.translationService.translate('courseForm.addSuccess'));
          this.router.navigate(['/courses']);
        },
        error: () => {
          this.submitting.set(false);
          this.toastService.error(this.translationService.translate('courseForm.addError'));
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
  }

  canDeactivate(): boolean {
    if (this.allowNavigation || !this.form?.dirty) {
      return true;
    }

    return confirm(this.translationService.translate('courseForm.unsavedChanges'));
  }
}
