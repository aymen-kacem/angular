import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutService } from 'src/app/shared/services/layout.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser$ = this.authService.currentUser$;

  constructor(
    private authService: AuthService,
    private layoutService: LayoutService,
    private router: Router
  ) {}

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'teacher': return 'Enseignant';
      case 'student': return 'Étudiant';
      default: return role;
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
