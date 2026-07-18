import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CoursesService {
     private baseUrl = 'http://localhost:3000/courses';

     constructor(private http: HttpClient) { }

     getCourses(): Observable<Course[]> {
          return this.http.get<Course[]>(this.baseUrl);
     }

     getCourseById(id: number): Observable<Course> {
          return this.http.get<Course>(`${this.baseUrl}/${id}`);
     }

     addCourse(course: Course): Observable<Course> {
          return this.http.post<Course>(this.baseUrl, course);
     }

     updateCourse(id: number, course: Course): Observable<Course> {
          return this.http.put<Course>(`${this.baseUrl}/${id}`, course);
     }

     deleteCourse(id: number): Observable<void> {
          return this.http.delete<void>(`${this.baseUrl}/${id}`);
     }
}