import { Injectable, computed, signal } from '@angular/core';
import { decodeJwt, getRolesFromClaims } from './utils/jwt.util';

@Injectable({ providedIn: 'root' })
export class AuthState {
  private _token = signal<string | null>(null);

  token = this._token.asReadonly();

  claims = computed(() => {
    const t = this._token();
    return t ? decodeJwt(t) : null;
  });

  roles = computed(() => getRolesFromClaims(this.claims()));

  isAuthenticated = computed(() => !!this._token());

  setToken(token: string | null) {
    this._token.set(token);
  }
}
