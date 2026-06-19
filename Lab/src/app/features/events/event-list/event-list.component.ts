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
import { CategoryService } from 'src/app/core/services/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  currentUser: User | null = null;
  studentRegistrations: Record<string | number, string | number> = {};
  searchQuery = '';
  selectedCategory = '';
  categories: string[] = [];
  loading = false;

  constructor(
    private eventService: EventService,
    private registrationService: RegistrationService,
    private authService: AuthService,
    private toastService: ToastService,
    private dialog: MatDialog,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats.map(c => c.name);
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.fetchData();
    });
  }

  fetchData(): void {
    if (!this.currentUser) return;
    this.loading = true;

    if (this.currentUser.role === 'student') {
      forkJoin({
        events: this.eventService.getAll(),
        registrations: this.registrationService.getByUser(this.currentUser.id)
      }).subscribe({
        next: ({ events, registrations }) => {
          this.events = events;
          this.filterEvents();
          this.studentRegistrations = {};
          registrations.forEach(r => {
            this.studentRegistrations[r.eventId] = r.id;
          });
          this.loading = false;
        },
        error: () => (this.loading = false)
      });
    } else {
      this.eventService.getAll().subscribe({
        next: (events) => {
          this.events = events;
          this.filterEvents();
          this.loading = false;
        },
        error: () => (this.loading = false)
      });
    }
  }

  filterEvents(): void {
    let result = this.events;

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(e => 
        e.title.toLowerCase().includes(query) || 
        e.description.toLowerCase().includes(query) || 
        e.location.toLowerCase().includes(query)
      );
    }

    if (this.selectedCategory) {
      result = result.filter(e => e.category === this.selectedCategory);
    }

    this.filteredEvents = result;
  }

  onSearchChange(): void {
    this.filterEvents();
  }

  onCategoryChange(): void {
    this.filterEvents();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.filterEvents();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '600px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Automatically inject current teacher id if current user is teacher
        const newEventData = {
          ...result,
          teacherId: this.currentUser?.role === 'teacher' ? this.currentUser.id : result.teacherId
        };
        this.eventService.create(newEventData).subscribe({
          next: () => {
            this.toastService.showSuccess('Événement créé avec succès !');
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

  deleteEvent(id: string | number): void {
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

  isRegistered(eventId: string | number): boolean {
    return !!this.studentRegistrations[eventId];
  }

  toggleRegistration(event: Event): void {
    if (!this.currentUser) return;
    const regId = this.studentRegistrations[event.id];

    if (regId) {
      this.registrationService.delete(regId).subscribe({
        next: () => {
          this.toastService.showInfo('Inscription annulée.');
          this.fetchData();
        }
      });
    } else {
      this.registrationService.getByEvent(event.id).subscribe(regs => {
        const confirmedRegs = regs.filter(r => r.status === 'confirmed').length;
        if (confirmedRegs >= event.capacity) {
          this.toastService.showError('Désolé, cet événement est déjà complet !');
          return;
        }
        this.registrationService.create(this.currentUser!.id, event.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Inscription confirmée !');
            this.fetchData();
          }
        });
      });
    }
  }

  canModify(event: Event): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.role === 'admin') return true;
    if (this.currentUser.role === 'teacher' && String(event.teacherId) === String(this.currentUser.id)) return true;
    return false;
  }
}
