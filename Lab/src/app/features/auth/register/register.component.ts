import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['student', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    const { email, password, fullName, role } = this.registerForm.value;
    this.authService.register(email, password, fullName, role)
      .then(() => {
        this.toastService.showSuccess('Inscription réussie !');
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        console.error(error);
        this.toastService.showError("Erreur d'inscription. Cet email est peut-être déjà utilisé.");
        this.loading = false;
      });
  }
}
