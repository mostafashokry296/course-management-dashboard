import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';

/** Validates route id format only. Course loading is handled by `courseResolver`. */
export const courseExistsGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const toastService = inject(ToastService);
  const translationService = inject(TranslationService);

  const id = Number(route.paramMap.get('id'));

  if (!Number.isInteger(id) || id <= 0) {
    toastService.error(translationService.translate('courseDetails.notFound'));
    return router.createUrlTree(['/courses']);
  }

  return true;
};
