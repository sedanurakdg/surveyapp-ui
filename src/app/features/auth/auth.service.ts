import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { LoginRequest, LoginResponse } from './models/auth.model';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isExpired, JwtUser, mapJwtUser } from '../../core/auth/jwt.util';

const TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  token = computed(() => this._token());

  user = computed<JwtUser | null>(() => {
    const t = this._token();
    if (!t) return null;
    try {
      if (isExpired(t)) return null;
      return mapJwtUser(t);
    } catch {
      return null;
    }
  });

  isLoggedIn = computed(() => !!this.user());
  roles = computed(() => this.user()?.roles ?? []);

  login(req: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/Auth/login`, req).pipe(
      map((res) => res.accessToken),
      tap((token) => this.setToken(token)),
      map(() => void 0),
    );
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }
  hasAnyRole(required: string[]): boolean {
    const userRoles = this.user()?.roles ?? [];

    return required.some((r) => userRoles.some((ur) => ur.toLowerCase() === r.toLowerCase()));
  }
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
  }
}
