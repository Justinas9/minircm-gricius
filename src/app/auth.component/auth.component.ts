import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  authForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
  }

  onSubmit(): void {
    if (!this.authForm.valid) {
      return;
    }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    this.isLoading = true;
    this.error = null;

    const authObs = this.isLoginMode
      ? this.authService.login(email, password)
      : this.authService.signup(email, password);

    authObs.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/companies']);
      },
      error: (errorMessage: Error) => {
        this.error = errorMessage.message;
        this.isLoading = false;
      }
    });

    this.authForm.reset();
  }
}
