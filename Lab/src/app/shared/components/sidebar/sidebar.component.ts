import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutService } from 'src/app/shared/services/layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  currentUser$ = this.authService.currentUser$;

  constructor(
    private authService: AuthService,
    private layoutService: LayoutService
  ) {}

  closeSidebar() {
    this.layoutService.setSidebarOpen(false);
  }
}
