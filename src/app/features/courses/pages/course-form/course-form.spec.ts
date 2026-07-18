import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CourseForm } from './course-form';
import { CoursesService } from '../../services/courses.service';
import { TranslationService } from '../../../../core/services/translation.service';

describe('CourseForm', () => {
  let component: CourseForm;
  let fixture: ComponentFixture<CourseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseForm],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideAnimations(),
        {
          provide: CoursesService,
          useValue: {
            getCourseById: () => of(null),
            addCourse: () => of({}),
            updateCourse: () => of({}),
          },
        },
        {
          provide: TranslationService,
          useValue: {
            translate: (key: string) => key,
            currentLang: () => 'en',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form invalid when required fields are empty', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should validate course name minimum length', () => {
    component.form.patchValue({
      courseName: 'Ab',
      instructorName: 'Ahmed',
      category: 'Frontend',
      duration: 10,
      price: 100,
      status: 'Active',
    });

    expect(component.form.get('courseName')?.valid).toBe(false);

    component.form.patchValue({ courseName: 'Angular' });
    expect(component.form.get('courseName')?.valid).toBe(true);
  });

  it('should allow leaving when form is pristine', () => {
    expect(component.canDeactivate()).toBe(true);
  });

  it('should ask before leaving when form is dirty', () => {
    component.form.markAsDirty();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    expect(component.canDeactivate()).toBe(false);
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
