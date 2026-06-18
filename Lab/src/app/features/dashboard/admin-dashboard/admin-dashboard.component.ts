import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  nbUsers = 0;
  nbEvents = 0;
  nbRegistrations = 0;

  roleLabels: string[] = [];
  roleDatasets: ChartDataset[] = [{ data: [] }];

  categoryLabels: string[] = [];
  categoryDatasets: ChartDataset[] = [{ data: [] }];

  teacherLabels: string[] = [];
  teacherDatasets: ChartDataset[] = [{ data: [] }];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getAdminStats().subscribe({
      next: (stats) => {
        this.nbUsers = stats.rolesDistribution.reduce((acc, curr) => acc + curr.count, 0);
        this.nbRegistrations = 0; // Or fetch separately if needed
        
        this.roleLabels = stats.rolesDistribution.map(r => r.name);
        this.roleDatasets = [{
          data: stats.rolesDistribution.map(r => r.count),
          backgroundColor: ['#e53935', '#43a047', '#1e88e5']
        }];

        this.categoryLabels = stats.eventsByCategory.map(c => c.category);
        this.nbEvents = stats.eventsByCategory.reduce((acc, curr) => acc + curr.count, 0);
        this.categoryDatasets = [{
          label: "Nombre d'événements",
          data: stats.eventsByCategory.map(c => c.count),
          backgroundColor: '#3f51b5'
        }];

        this.teacherLabels = stats.eventsByTeacher.map(t => t.teacher);
        this.teacherDatasets = [{
          label: "Nombre d'événements",
          data: stats.eventsByTeacher.map(t => t.count),
          backgroundColor: '#ff9800'
        }];

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
