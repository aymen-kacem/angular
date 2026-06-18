import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from 'src/app/core/services/event.service';
import { RegistrationService } from 'src/app/core/services/registration.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { EventFormComponent } from '../event-form/event-form.component';
import { Event } from 'src/app/core/models/event.model';
import { User } from 'src/app/core/models/user.model';
import { Registration } from 'src/app/core/models/registration.model';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  currentUser: User | null = null;
  teacherEvents: Event[] = [];
  studentRegistrations: Registration[] = [];
  loading = false;

  constructor(
    private eventService: EventService,
    private registrationService: RegistrationService,
    private authService: AuthService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.fetchData();
    });
  }

  fetchData(): void {
    if (!this.currentUser) return;
    this.loading = true;

    if (this.currentUser.role === 'teacher') {
      this.eventService.getByTeacher(this.currentUser.id).subscribe({
        next: (events) => {
          this.teacherEvents = events;
          this.loading = false;
        },
        error: () => (this.loading = false)
      });
    } else if (this.currentUser.role === 'student') {
      this.registrationService.getByUser(this.currentUser.id).subscribe({
        next: (regs) => {
          this.studentRegistrations = regs;
          this.loading = false;
        },
        error: () => (this.loading = false)
      });
    } else {
      this.loading = false;
    }
  }

  cancelRegistration(regId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: "Annuler l'inscription",
        message: "Êtes-vous sûr de vouloir annuler votre inscription à cet événement ?"
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.registrationService.delete(regId).subscribe({
          next: () => {
            this.toastService.showSuccess('Inscription annulée.');
            this.fetchData();
          }
        });
      }
    });
  }

  openEditDialog(event: Event): void {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: event
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.update(event.id, result).subscribe({
          next: () => {
            this.toastService.showSuccess('Événement modifié avec succès !');
            this.fetchData();
          }
        });
      }
    });
  }

  deleteEvent(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: "Supprimer l'événement",
        message: "Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible."
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.eventService.delete(id).subscribe({
          next: () => {
            this.toastService.showSuccess('Événement supprimé avec succès !');
            this.fetchData();
          }
        });
      }
    });
  }
}
