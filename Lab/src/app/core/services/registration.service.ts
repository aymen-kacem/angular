import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Registration } from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = `${environment.apiUrl}/registrations`;

  constructor(private http: HttpClient) {}

  getByEvent(eventId: string | number): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}?eventId=${eventId}&_expand=user`);
  }

  getByUser(userId: string | number): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}?userId=${userId}&_expand=event`);
  }

  getAll(): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}?_expand=user&_expand=event`);
  }

  create(userId: string | number, eventId: string | number): Observable<Registration> {
    const newReg: Omit<Registration, 'id'> = {
      userId,
      eventId,
      status: 'confirmed',
      registeredAt: new Date().toISOString()
    };
    return this.http.post<Registration>(this.apiUrl, newReg);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string | number, status: 'confirmed' | 'pending' | 'cancelled'): Observable<Registration> {
    return this.http.patch<Registration>(`${this.apiUrl}/${id}`, { status });
  }
}
