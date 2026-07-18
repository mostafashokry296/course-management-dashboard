import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CourseDetails } from './course-details';
import { TranslationService } from '../../../../core/services/translation.service';

describe('CourseDetails', () => {
  let component: CourseDetails;
  let fixture: ComponentFixture<CourseDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetails],
      providers: [
        provideRouter([]),
        provideAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
              data: {
                course: {
                  id: 1,
                  courseName: 'Angular Fundamentals',
                  instructorName: 'Ahmed Ali',
                  category: 'Frontend',
                  duration: 20,
                  price: 1500,
                  status: 'Active',
                  createdDate: '2026-06-01',
                  description: 'Intro course',
                },
              },
            },
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

    fixture = TestBed.createComponent(CourseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load course details from resolver data', () => {
    expect(component.course()?.courseName).toBe('Angular Fundamentals');
    expect(component.loading()).toBe(false);
  });
});
