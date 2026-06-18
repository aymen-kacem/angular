import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/course.service';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { User } from 'src/app/core/models/user.model';
import { Course, CourseResource } from 'src/app/core/models/course.model';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  courseId: string | null = null;
  teachers: User[] = [];
  currentUser: User | null = null;
  levels = ['1ère année Licence', '2ème année Licence', '3ème année Licence', '1ère année Master', '2ème année Master', 'Autre'];
  resourceTypes = [
    { value: 'pdf_chapter', label: 'Chapitre (PDF)' },
    { value: 'summary', label: 'Résumé' },
    { value: 'exercise', label: 'Exercice' },
    { value: 'correction', label: 'Correction' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      level: ['', Validators.required],
      teacherIds: [[], Validators.required],
      resources: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // If user is a teacher, preselect their ID in the form
      if (user && user.role === 'teacher') {
        this.form.patchValue({ teacherIds: [user.id] });
      }
    });

    this.userService.getAll().subscribe(users => {
      this.teachers = users.filter(u => u.role === 'teacher');
    });

    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.isEditMode = true;
        this.courseId = params.get('id');
        this.loadCourse(this.courseId!);
      }
    });
  }

  get resources(): FormArray {
    return this.form.get('resources') as FormArray;
  }

  addResource(resource?: CourseResource): void {
    const isLocal = resource?.isLocalFile ?? false;
    const resourceForm = this.fb.group({
      id: [resource?.id || this.generateId()],
      title: [resource?.title || '', Validators.required],
      type: [resource?.type || 'pdf_chapter', Validators.required],
      uploadType: [isLocal ? 'file' : 'link'],
      url: [resource?.url || '', Validators.required],
      fileName: [resource?.fileName || ''],
      isLocalFile: [isLocal]
    });

    resourceForm.get('uploadType')?.valueChanges.subscribe(val => {
      resourceForm.patchValue({ url: '', fileName: '', isLocalFile: val === 'file' });
    });

    this.resources.push(resourceForm);
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.resources.at(index).patchValue({
          url: base64String,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeResource(index: number): void {
    this.resources.removeAt(index);
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  loadCourse(id: string): void {
    this.courseService.getById(id).subscribe({
      next: (course) => {
        this.form.patchValue({
          title: course.title,
          description: course.description,
          level: course.level,
          teacherIds: course.teacherIds
        });
        
        if (course.resources) {
          course.resources.forEach(res => this.addResource(res));
        }
      },
      error: () => {
        this.toastService.showError('Cours introuvable.');
        this.router.navigate(['/courses']);
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const courseData = { ...this.form.value };
    
    if (this.isEditMode && this.courseId) {
      this.courseService.update(this.courseId, courseData).subscribe({
        next: () => {
          this.toastService.showSuccess('Cours mis à jour avec succès.');
          this.router.navigate(['/courses']);
        }
      });
    } else {
      courseData.createdAt = new Date().toISOString();
      this.courseService.create(courseData).subscribe({
        next: () => {
          this.toastService.showSuccess('Cours créé avec succès.');
          this.router.navigate(['/courses']);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/courses']);
  }
}
