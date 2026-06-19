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

  statusLabels: string[] = [];
  statusDatasets: ChartDataset[] = [{ data: [] }];

  levelLabels: string[] = [];
  levelDatasets: ChartDataset[] = [{ data: [] }];

  monthLabels: string[] = [];
  monthDatasets: ChartDataset[] = [{ data: [] }];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  // Charts that don't need a legend (single-series bars / line)
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  };

  horizontalBarOptions: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }
  };

  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getAdminStats().subscribe({
      next: (stats) => {
        this.nbUsers = stats.rolesDistribution.reduce((acc, curr) => acc + curr.count, 0);
        this.nbRegistrations = stats.totalRegistrations;

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
          backgroundColor: '#3949ab'
        }];

        this.teacherLabels = stats.eventsByTeacher.map(t => t.teacher);
        this.teacherDatasets = [{
          label: "Nombre d'événements",
          data: stats.eventsByTeacher.map(t => t.count),
          backgroundColor: '#3949ab'
        }];

        // Registrations by status (doughnut)
        this.statusLabels = stats.registrationsByStatus.map(s => s.status);
        this.statusDatasets = [{
          data: stats.registrationsByStatus.map(s => s.count),
          backgroundColor: ['#16a34a', '#f59e0b', '#dc2626']
        }];

        // Courses by level (horizontal bar)
        this.levelLabels = stats.coursesByLevel.map(l => l.level);
        this.levelDatasets = [{
          label: 'Nombre de cours',
          data: stats.coursesByLevel.map(l => l.count),
          backgroundColor: '#6366f1'
        }];

        // Events by month (line)
        this.monthLabels = stats.eventsByMonth.map(m => m.month);
        this.monthDatasets = [{
          label: "Événements",
          data: stats.eventsByMonth.map(m => m.count),
          borderColor: '#1a237e',
          backgroundColor: 'rgba(57, 73, 171, 0.15)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#1a237e'
        }];

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
