import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    let { email, password } = this.loginForm.value;
    
    // Safety check to remove any accidental trailing spaces
    email = email ? email.trim() : '';
    password = password ? password.trim() : '';

    this.authService.login(email, password)
      .then(() => {
        this.toastService.showSuccess('Connexion réussie !');
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        this.toastService.showError('Identifiants incorrects ou compte introuvable.');
        this.loading = false;
      });
  }
}
