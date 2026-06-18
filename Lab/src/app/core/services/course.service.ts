import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getById(id: string | number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getByTeacher(teacherId: string | number): Observable<Course[]> {
    // Note: json-server doesn't natively filter arrays easily like this unless we use custom queries
    // For now we fetch all and filter client side
    return new Observable<Course[]>(observer => {
      this.getAll().subscribe(courses => {
        observer.next(courses.filter(c => c.teacherIds.includes(teacherId) || c.teacherIds.includes(Number(teacherId))));
        observer.complete();
      });
    });
  }

  getByLevel(level: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}?level=${level}`);
  }

  create(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  update(id: string | number, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
