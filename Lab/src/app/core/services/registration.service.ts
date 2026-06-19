import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Registration } from '../models/registration.model';
import { User } from '../models/user.model';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = `${environment.apiUrl}/registrations`;
  private usersUrl = `${environment.apiUrl}/users`;
  private eventsUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  // json-server v1 dropped the `_expand`/`_embed` relational params the app was
  // built against, so we hydrate the related records in memory instead. The
  // returned shape (reg.user / reg.event) stays identical for the templates.
  private withEvents(regs: Registration[]): Observable<Registration[]> {
    if (!regs.length) return of(regs);
    return this.http.get<Event[]>(this.eventsUrl).pipe(
      map(events => regs.map(r => ({
        ...r,
        event: events.find(e => String(e.id) === String(r.eventId))
      })))
    );
  }

  private withUsers(regs: Registration[]): Observable<Registration[]> {
    if (!regs.length) return of(regs);
    return this.http.get<User[]>(this.usersUrl).pipe(
      map(users => regs.map(r => ({
        ...r,
        user: users.find(u => String(u.id) === String(r.userId))
      })))
    );
  }

  getByEvent(eventId: number): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}?eventId=${eventId}`).pipe(
      switchMap(regs => this.withUsers(regs))
    );
  }

  getByUser(userId: number): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      switchMap(regs => this.withEvents(regs))
    );
  }

  getAll(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.apiUrl).pipe(
      switchMap(regs => this.withUsers(regs)),
      switchMap(regs => this.withEvents(regs))
    );
  }

  create(userId: number, eventId: number): Observable<Registration> {
    const newReg: Omit<Registration, 'id'> = {
      userId,
      eventId,
      status: 'confirmed',
      registeredAt: new Date().toISOString()
    };
    return this.http.post<Registration>(this.apiUrl, newReg);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: 'confirmed' | 'pending' | 'cancelled'): Observable<Registration> {
    return this.http.patch<Registration>(`${this.apiUrl}/${id}`, { status });
  }
}
