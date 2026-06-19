import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getById(id: string | number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  create(event: Omit<Event, 'id' | 'createdAt'>): Observable<Event> {
    const newEvent = {
      ...event,
      createdAt: new Date().toISOString()
    };
    return this.http.post<Event>(this.apiUrl, newEvent);
  }

  update(id: string | number, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByTeacher(teacherId: string | number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}?teacherId=${teacherId}`);
  }
}
