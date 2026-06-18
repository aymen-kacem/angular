import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  form!: FormGroup;
  currentUser: User | null = null;
  loading = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.initForm(user);
      }
    });
  }

  initForm(user: User): void {
    this.form = this.fb.group({
      fullName: [user.fullName, Validators.required],
      avatarUrl: [user.avatarUrl || '']
    });
  }

  onSubmit(): void {
    if (!this.currentUser || this.form.invalid) return;

    this.loading = true;
    const updatedData = {
      ...this.currentUser,
      fullName: this.form.value.fullName,
      avatarUrl: this.form.value.avatarUrl
    };

    this.userService.update(this.currentUser.id, updatedData).subscribe({
      next: () => {
        this.toastService.showSuccess('Profil mis à jour avec succès.');
        this.authService.refreshProfile();
        this.router.navigate(['/profile']);
        this.loading = false;
      },
      error: () => {
        this.toastService.showError('Erreur lors de la mise à jour.');
        this.loading = false;
      }
    });
  }
}

