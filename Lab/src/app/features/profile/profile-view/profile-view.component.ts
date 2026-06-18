import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { RegistrationService } from 'src/app/core/services/registration.service';
import { User } from 'src/app/core/models/user.model';
import { Registration } from 'src/app/core/models/registration.model';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  currentUser: User | null = null;
  studentRegistrations: Registration[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.role === 'student') {
        this.fetchStudentEvents(user.id);
      }
    });
  }

  fetchStudentEvents(userId: number): void {
    this.loading = true;
    this.registrationService.getByUser(userId).subscribe({
      next: (regs) => {
        this.studentRegistrations = regs;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'teacher': return 'Enseignant';
      case 'student': return 'Étudiant';
      default: return role;
    }
  }
}
