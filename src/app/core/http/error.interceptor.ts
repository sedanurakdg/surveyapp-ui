import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {
      if (err?.status === 401) {
        auth.logout();
        router.navigateByUrl('/login');
      }
      if (err?.status === 403) {
        router.navigateByUrl('/forbidden');
      }
      return throwError(() => err);
    })
  );
};
