import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CoursesListComponent } from './courses-list';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/course.model';
import { TranslationService } from '../../../../core/services/translation.service';

describe('CoursesListComponent', () => {
  let component: CoursesListComponent;
  let fixture: ComponentFixture<CoursesListComponent>;

  const courses: Course[] = [
    {
      id: 1,
      courseName: 'Angular Fundamentals',
      instructorName: 'Ahmed Ali',
      category: 'Frontend',
      duration: 20,
      price: 1500,
      status: 'Active',
      createdDate: '2026-06-01',
    },
    {
      id: 2,
      courseName: 'Node API',
      instructorName: 'Sara Nabil',
      category: 'Backend',
      duration: 30,
      price: 2000,
      status: 'Draft',
      createdDate: '2026-05-01',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesListComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideAnimations(),
        {
          provide: CoursesService,
          useValue: {
            getCourses: () => of(courses),
            deleteCourse: () => of(void 0),
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

    fixture = TestBed.createComponent(CoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter courses by search term', () => {
    component.searchTerm = 'angular';
    component.applyFilters();
    expect(component.filteredCourses().length).toBe(1);
    expect(component.filteredCourses()[0].courseName).toContain('Angular');
  });

  it('should filter courses by status', () => {
    component.statusFilter = 'Draft';
    component.applyFilters();
    expect(component.filteredCourses().length).toBe(1);
    expect(component.filteredCourses()[0].status).toBe('Draft');
  });

  it('should sort courses by price ascending', () => {
    component.sortBy = 'priceAsc';
    component.applyFilters();
    expect(component.filteredCourses()[0].price).toBe(1500);
    expect(component.filteredCourses()[1].price).toBe(2000);
  });

  it('should paginate results with MatPaginator page events', () => {
    component.pageSize.set(1);
    component.applyFilters();
    expect(component.pagedCourses().length).toBe(1);
    expect(component.pageIndex()).toBe(0);

    component.onPage({
      pageIndex: 1,
      pageSize: 1,
      length: component.filteredCourses().length,
    });

    expect(component.pageIndex()).toBe(1);
    expect(component.pagedCourses()[0].id).toBe(component.filteredCourses()[1].id);
  });
});
