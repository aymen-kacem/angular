import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/course.service';
import { UserService } from 'src/app/core/services/user.service';
import { Course, CourseResource } from 'src/app/core/models/course.model';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  teachers: User[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCourse(id);
      } else {
        this.router.navigate(['/courses']);
      }
    });
  }

  loadCourse(id: string): void {
    this.loading = true;
    this.courseService.getById(id).subscribe({
      next: (course) => {
        this.course = course;
        this.loadTeachers(course.teacherIds);
      },
      error: () => {
        this.router.navigate(['/courses']);
      }
    });
  }

  loadTeachers(teacherIds: (string | number)[]): void {
    this.userService.getAll().subscribe(users => {
      this.teachers = users.filter(u => teacherIds.includes(u.id) || teacherIds.includes(Number(u.id)));
      this.loading = false;
    });
  }

  getIconForType(type: string): string {
    switch(type) {
      case 'pdf_chapter': return 'picture_as_pdf';
      case 'summary': return 'article';
      case 'exercise': return 'assignment';
      case 'correction': return 'fact_check';
      default: return 'insert_drive_file';
    }
  }

  getLabelForType(type: string): string {
    switch(type) {
      case 'pdf_chapter': return 'Chapitre (PDF)';
      case 'summary': return 'Résumé';
      case 'exercise': return 'Exercice';
      case 'correction': return 'Correction';
      default: return 'Document';
    }
  }

  openResource(resource: CourseResource): void {
    if (resource.isLocalFile) {
      const link = document.createElement('a');
      link.href = resource.url;
      link.download = resource.fileName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(resource.url, '_blank');
    }
  }
}
