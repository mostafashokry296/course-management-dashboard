import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';

export interface DataTableColumn<T> {
  key: string;
  headerKey: string;
  cellClass?: string;
  cellType?: 'text' | 'badge';
  valueFn?: (row: T) => string | number;
  badgeClassFn?: (row: T) => string;
  cellTemplate?: TemplateRef<{ $implicit: T }>;
}

export interface DataTableAction<T> {
  labelKey: string;
  icon?: string;
  buttonClass?: string;
  onClick: (row: T) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTableComponent<T extends { id?: number | string }> {
  @Input({ required: true }) columns: DataTableColumn<T>[] = [];
  @Input({ required: true }) rows: T[] = [];
  @Input() actions: DataTableAction<T>[] = [];
  @Input() emptyMessageKey = 'coursesList.noCourses';

  constructor(private translationService: TranslationService) {}

  get displayedColumns(): string[] {
    return [
      ...this.columns.map((column) => column.key),
      ...(this.actions.length ? ['actions'] : []),
    ];
  }

  getCellValue(row: T, column: DataTableColumn<T>): string | number {
    if (column.valueFn) {
      return column.valueFn(row);
    }

    const value = row[column.key as keyof T];
    if (value == null) {
      return '';
    }

    return value as string | number;
  }

  getBadgeClass(row: T, column: DataTableColumn<T>): string {
    return column.badgeClassFn?.(row) ?? 'status-badge status-default';
  }

  getActionLabel(action: DataTableAction<T>): string {
    return this.translationService.translate(action.labelKey);
  }
}
