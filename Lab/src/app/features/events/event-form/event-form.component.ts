import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { Event } from 'src/app/core/models/event.model';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  currentUser: User | null = null;
  teachers: User[] = [];
  categories: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event | null,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private categoryService: CategoryService
  ) {
    this.isEditMode = !!data;
    
    this.form = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || ''],
      category: [data?.category || 'Workshop', Validators.required],
      date: [data?.date || '', [Validators.required, this.dateTodayOrFutureValidator]],
      startTime: [data?.startTime || '09:00', Validators.required],
      endTime: [data?.endTime || '12:00', Validators.required],
      location: [data?.location || '', Validators.required],
      capacity: [data?.capacity || 10, [Validators.required, Validators.min(1)]],
      imageUrl: [data?.imageUrl || ''],
      teacherId: [data?.teacherId || null]
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats.map(c => c.name);
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      if (user?.role === 'admin') {
        this.userService.getAll().subscribe(users => {
          this.teachers = users.filter(u => u.role === 'teacher');
          this.form.get('teacherId')?.setValidators(Validators.required);
          this.form.get('teacherId')?.updateValueAndValidity();
        });
      }
    });
  }

  dateTodayOrFutureValidator(control: AbstractControl): Record<string, any> | null {
    if (!control.value) {
      return null;
    }
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate >= today ? null : { pastDate: true };
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
