import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../config/app-config';
import { Endpoint } from './endpoint';
import { AuthService } from '../auth/auth.service';

type Query = Record<string, string | number | boolean | undefined | null>;

@Injectable({ providedIn: 'root' })
export class ApiClient {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private cfg: AppConfig,
    private auth: AuthService,
  ) {}

  get<T>(path: string, query?: Query) {
    return this.http.get<T>(this.url(path), {
      params: this.toParams(query),
    });
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(this.url(path), body, {});
  }

  put<T>(path: string, body: unknown) {
    return this.http.put<T>(this.url(path), body, {});
  }

  delete<T>(path: string) {
    return this.http.delete<T>(this.url(path), {});
  }

  call<TRes, TReq>(ep: Endpoint<TRes, TReq>, body?: TReq, query?: Record<string, any>) {
    switch (ep.method) {
      case 'GET':
        return this.get<TRes>(ep.path, query);
      case 'POST':
        return this.post<TRes>(ep.path, body);
      case 'PUT':
        return this.put<TRes>(ep.path, body);
      case 'DELETE':
        return this.delete<TRes>(ep.path);
    }
  }

  private url(path: string) {
    return `${this.cfg.apiBaseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  private toParams(query?: Query) {
    let params = new HttpParams();
    if (!query) return params;

    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      params = params.set(k, String(v));
    }
    return params;
  }

  private isAnonymousPath(path: string): boolean {
    const p = path.toLowerCase();
    return p.includes('/api/auth/login');
  }
}
