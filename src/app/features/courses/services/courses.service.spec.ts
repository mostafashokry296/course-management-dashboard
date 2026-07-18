import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { Course } from '../models/course.model';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000/courses';

  const mockCourse: Course = {
    id: 1,
    courseName: 'Angular Fundamentals',
    instructorName: 'Ahmed Ali',
    category: 'Frontend',
    duration: 20,
    price: 1500,
    status: 'Active',
    createdDate: '2026-06-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CoursesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all courses', () => {
    service.getCourses().subscribe((courses) => {
      expect(courses).toEqual([mockCourse]);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockCourse]);
  });

  it('should fetch a course by id', () => {
    service.getCourseById(1).subscribe((course) => {
      expect(course).toEqual(mockCourse);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCourse);
  });

  it('should create a course', () => {
    const payload = { ...mockCourse };
    delete payload.id;

    service.addCourse(payload).subscribe((course) => {
      expect(course.id).toBe(1);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockCourse);
  });

  it('should update a course', () => {
    service.updateCourse(1, mockCourse).subscribe((course) => {
      expect(course.courseName).toBe('Angular Fundamentals');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockCourse);
  });

  it('should delete a course', () => {
    let completed = false;

    service.deleteCourse(1).subscribe({
      next: () => {
        completed = true;
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(completed).toBe(true);
  });
});

