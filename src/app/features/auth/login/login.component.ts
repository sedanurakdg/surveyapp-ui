import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../core/auth/auth.service';
import { LoginRequest } from '../../../core/auth/models/auth.model';
import { getHttpErrorMessage } from '../../../core/utils/http.util';

import { AppPageComponent } from '../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../shared/ui/app-card/app-card.component';
import { AppFormFieldComponent } from '../../../shared/ui/app-form-field/app-form-field.component';
import { AppButtonComponent } from '../../../shared/ui/app-button/app-button.component';
import { AppAlertComponent } from '../../../shared/ui/app-alert/app-alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppPageComponent,
    AppCardComponent,
    AppFormFieldComponent,
    AppButtonComponent,
    AppAlertComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    this.error.set(null);

    if (this.loading()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Lütfen email ve şifre alanlarını kontrol edin.');
      return;
    }

    const body = this.form.getRawValue() as LoginRequest;

    this.loading.set(true);

    this.auth
      .login(body)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
            return;
          }

          const roles = this.auth.roles();
          const target = roles.includes('Admin') ? '/admin' : '/user';
          this.router.navigateByUrl(target);
        },

        error: (e) => {
          this.error.set(getHttpErrorMessage(e, 'Login başarısız.'));
        },
      });
  }

  clearError(): void {
    this.error.set(null);
  }
}
