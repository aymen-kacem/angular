import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { RegistrationService } from 'src/app/core/services/registration.service';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Event } from 'src/app/core/models/event.model';
import { User } from 'src/app/core/models/user.model';
import { Registration } from 'src/app/core/models/registration.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  currentUser: User | null = null;
  teacherName = '';
  registrations: Registration[] = [];
  studentRegistrationId: string | number | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private registrationService: RegistrationService,
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) {
      this.toastService.showError("ID d'événement invalide.");
      this.router.navigate(['/events']);
      return;
    }

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadEventDetails(eventId);
    });
  }

  loadEventDetails(eventId: string | number): void {
    this.loading = true;
    this.eventService.getById(eventId).subscribe({
      next: (event) => {
        this.event = event;
        
        this.userService.getById(event.teacherId).subscribe({
          next: (teacher) => {
            this.teacherName = teacher.fullName;
          },
          error: () => {
            this.teacherName = 'Enseignant inconnu';
          }
        });

        if (this.canViewParticipants()) {
          this.registrationService.getByEvent(eventId).subscribe({
            next: (regs) => {
              this.registrations = regs;
            }
          });
        }

        if (this.currentUser && this.currentUser.role === 'student') {
          this.registrationService.getByUser(this.currentUser.id).subscribe({
            next: (regs) => {
              const userReg = regs.find(r => r.eventId === eventId);
              this.studentRegistrationId = userReg ? userReg.id : null;
            }
          });
        }
        
        this.loading = false;
      },
      error: () => {
        this.toastService.showError("Impossible de charger l'événement.");
        this.router.navigate(['/events']);
        this.loading = false;
      }
    });
  }

  canViewParticipants(): boolean {
    if (!this.currentUser || !this.event) return false;
    if (this.currentUser.role === 'admin') return true;
    if (this.currentUser.role === 'teacher' && String(this.event.teacherId) === String(this.currentUser.id)) return true;
    return false;
  }

  toggleRegistration(): void {
    if (!this.currentUser || !this.event) return;

    if (this.studentRegistrationId) {
      this.registrationService.delete(this.studentRegistrationId).subscribe({
        next: () => {
          this.toastService.showInfo('Inscription annulée.');
          this.loadEventDetails(this.event!.id);
        }
      });
    } else {
      this.registrationService.getByEvent(this.event.id).subscribe(regs => {
        const confirmedRegs = regs.filter(r => r.status === 'confirmed').length;
        if (confirmedRegs >= this.event!.capacity) {
          this.toastService.showError('Désolé, cet événement est complet !');
          return;
        }

        this.registrationService.create(this.currentUser!.id, this.event!.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Inscription confirmée !');
            this.loadEventDetails(this.event!.id);
          }
        });
      });
    }
  }

  updateRegistrationStatus(reg: Registration, status: 'confirmed' | 'pending' | 'cancelled'): void {
    this.registrationService.updateStatus(reg.id, status).subscribe({
      next: () => {
        this.toastService.showSuccess('Statut mis à jour.');
        this.loadEventDetails(this.event!.id);
      }
    });
  }
}
