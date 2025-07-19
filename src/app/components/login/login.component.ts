import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
  // Remove 'standalone: true' if present
  // Remove 'imports: []' if present
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  isSignUp = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.error = '';
  }

  async onSubmit() {
    if (this.isSignUp && this.signupForm.valid) {
      const { email, password, confirmPassword } = this.signupForm.value;
      
      if (password !== confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      try {
        this.loading = true;
        await this.authService.signUpWithEmail(email, password);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    } else if (!this.isSignUp && this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      try {
        this.loading = true;
        await this.authService.signInWithEmail(email, password);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  }

  async signInWithGoogle() {
    try {
      this.loading = true;
      await this.authService.signInWithGoogle();
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
}
