import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Course } from '../models/course.model';
import { CoursesService } from '../services/courses.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';

export const courseResolver: ResolveFn<Course | null> = (route) => {
  const coursesService = inject(CoursesService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const translationService = inject(TranslationService);

  const id = Number(route.paramMap.get('id'));

  if (!Number.isInteger(id) || id <= 0) {
    toastService.error(translationService.translate('courseDetails.notFound'));
    router.navigate(['/courses']);
    return of(null);
  }

  return coursesService.getCourseById(id).pipe(
    catchError(() => {
      toastService.error(translationService.translate('courseDetails.loadError'));
      router.navigate(['/courses']);
      return of(null);
    }),
  );
};
