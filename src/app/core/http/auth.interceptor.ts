import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // computed/signal değerini OKU
  const token = auth.token(); // <-- KRİTİK: parantez

  // login endpoint'inde token ekleme
 const isAuthCall = req.url.toLowerCase().includes('/api/auth/login'.toLowerCase());

  if (!token || isAuthCall) return next(req);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  );
};
