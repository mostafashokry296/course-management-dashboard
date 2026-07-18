import { Injectable, effect, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslationService } from './translation.service';

@Injectable()
export class TranslatedMatPaginatorIntl extends MatPaginatorIntl {
  private readonly translationService = inject(TranslationService);

  constructor() {
    super();

    effect(() => {
      this.translationService.currentLang();
      this.applyLabels();
    });
  }

  private applyLabels(): void {
    this.itemsPerPageLabel = this.translationService.translate('paginator.itemsPerPage');
    this.nextPageLabel = this.translationService.translate('paginator.nextPage');
    this.previousPageLabel = this.translationService.translate('paginator.previousPage');
    this.firstPageLabel = this.translationService.translate('paginator.firstPage');
    this.lastPageLabel = this.translationService.translate('paginator.lastPage');
    this.changes.next();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return this.translationService
        .translate('paginator.rangeEmpty')
        .replace('{{length}}', `${length}`);
    }

    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);

    return this.translationService
      .translate('paginator.range')
      .replace('{{start}}', `${start}`)
      .replace('{{end}}', `${end}`)
      .replace('{{length}}', `${length}`);
  };
}
