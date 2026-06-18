import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "Une erreur inconnue s'est produite.";
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erreur : ${error.error.message}`;
        } else {
          if (error.status === 403) {
            errorMessage = "Accès refusé : vous n'avez pas les privilèges requis.";
          } else if (error.status === 404) {
            errorMessage = "Ressource introuvable.";
          } else if (error.status === 401) {
            errorMessage = "Non authentifié ou session expirée.";
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
        }
        this.toastService.showError(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
