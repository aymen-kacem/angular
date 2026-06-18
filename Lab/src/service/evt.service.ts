import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event as Evenement } from '../app/core/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EvtService {

  constructor(private http: HttpClient
  ) { }
  GetAllEvts(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>('http://localhost:3000/evenements');
  }
  AddEvent(event: Evenement): Observable<void> {
    return this.http.post<void>('http://localhost:3000/evenements', event);
  }
  getEvtById(data: string): Observable<Evenement> {
    return this.http.get<Evenement>(`http://localhost:3000/evenements/${data}`);
  }
  updateEvt(event: Evenement, id: string): Observable<void> {
    return this.http.put<void>(`http://localhost:3000/evenements/${id}`, event);
  }
  deleteEvt(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/evenements/${id}`);
  }
  deleteEvtById(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/evenements/${id}`);
  }

}
