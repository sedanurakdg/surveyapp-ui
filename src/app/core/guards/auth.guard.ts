import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // loggedIn kontrolünü kendi AuthService’ine göre uyarlayacağız
  const isLoggedIn = auth.isLoggedIn(); // token var + süresi geçmemiş vs.

  if (isLoggedIn) return true;

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
