import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { courseExistsGuard } from './course-exists.guard';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';

describe('courseExistsGuard', () => {
  let router: Router;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: TranslationService,
          useValue: {
            translate: (key: string) => key,
          },
        },
      ],
    });

    router = TestBed.inject(Router);
    toastService = TestBed.inject(ToastService);
    vi.spyOn(toastService, 'error').mockImplementation(() => undefined);
  });

  it('should redirect when id is invalid', () => {
    const result = TestBed.runInInjectionContext(() =>
      courseExistsGuard({ paramMap: { get: () => 'abc' } } as never, {} as never),
    );

    expect(result).toEqual(router.createUrlTree(['/courses']));
    expect(toastService.error).toHaveBeenCalled();
  });

  it('should allow activation when id is valid', () => {
    const result = TestBed.runInInjectionContext(() =>
      courseExistsGuard({ paramMap: { get: () => '1' } } as never, {} as never),
    );

    expect(result).toBe(true);
  });
});
