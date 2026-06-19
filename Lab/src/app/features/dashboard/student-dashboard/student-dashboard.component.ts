import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  currentUser: User | null = null;
  nbMyRegistrations = 0;
  registrations: any[] = [];

  categoryLabels: string[] = [];
  categoryDatasets: ChartDataset[] = [{ data: [] }];
  
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.fetchStats(user.id);
      }
    });
  }

  fetchStats(studentId: number): void {
    this.loading = true;
    this.dashboardService.getStudentStats(studentId).subscribe({
      next: (stats) => {
        this.registrations = stats.myRegistrations;
        this.nbMyRegistrations = stats.myRegistrations.length;

        this.categoryLabels = stats.registrationsByCategory.map(c => c.category);
        this.categoryDatasets = [{
          label: "Nombre d'événements rejoints",
          data: stats.registrationsByCategory.map(c => c.count),
          backgroundColor: '#3949ab'
        }];

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
