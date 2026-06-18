import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { Event } from 'src/app/core/models/event.model';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {
  currentUser: User | null = null;
  nbMyEvents = 0;
  upcomingEvents: Event[] = [];

  eventLabels: string[] = [];
  eventDatasets: ChartDataset[] = [{ data: [] }];
  
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

  fetchStats(teacherId: number): void {
    this.loading = true;
    this.dashboardService.getTeacherStats(teacherId).subscribe({
      next: (stats) => {
        this.nbMyEvents = stats.eventsWithParticipantCount.length;
        this.upcomingEvents = stats.upcomingEvents;

        this.eventLabels = stats.eventsWithParticipantCount.map(e => e.title);
        this.eventDatasets = [{
          label: 'Nombre de participants',
          data: stats.eventsWithParticipantCount.map(e => e.count),
          backgroundColor: '#2e7d32'
        }];

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
