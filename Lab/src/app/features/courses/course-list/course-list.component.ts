import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/course.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Course } from 'src/app/core/models/course.model';
import { User } from 'src/app/core/models/user.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'level', 'resourcesCount', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Course>([]);
  loading = false;
  currentUser: User | null = null;
  levels = ['1ère année Licence', '2ème année Licence', '3ème année Licence', '1ère année Master', '2ème année Master', 'Autre'];
  selectedLevel = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.fetchCourses();
    });
  }

  fetchCourses(): void {
    this.loading = true;
    this.courseService.getAll().subscribe({
      next: (courses) => {
        let filteredCourses = courses;
        
        if (this.selectedLevel) {
            filteredCourses = filteredCourses.filter(c => c.level === this.selectedLevel);
        }

        this.dataSource.data = filteredCourses;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  canEdit(course: Course): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.role === 'admin') return true;
    if (this.currentUser.role === 'teacher' && course.teacherIds && course.teacherIds.includes(this.currentUser.id)) return true;
    if (this.currentUser.role === 'teacher' && course.teacherIds && course.teacherIds.includes(Number(this.currentUser.id))) return true;
    return false;
  }

  deleteCourse(course: Course): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer le cours',
        message: `Êtes-vous sûr de vouloir supprimer le cours "${course.title}" ? Tous les documents associés seront inaccessibles.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.courseService.delete(course.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Cours supprimé avec succès.');
            this.fetchCourses();
          }
        });
      }
    });
  }
}
