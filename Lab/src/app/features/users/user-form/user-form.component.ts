import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null,
    private fb: FormBuilder
  ) {
    this.isEditMode = !!data;
    
    this.form = this.fb.group({
      fullName: [data?.fullName || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      role: [data?.role || 'student', Validators.required],
      avatarUrl: [data?.avatarUrl || '']
    });
  }

  ngOnInit(): void {}

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
