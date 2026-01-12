import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/http/auth.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { GlobalErrorHandler } from './core/utils/global-error-handler';
import { APP_CONFIG } from './core/config/app-config';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withComponentInputBinding(), withEnabledBlockingInitialNavigation()),
  provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  { provide: ErrorHandler, useClass: GlobalErrorHandler },
  { provide: APP_CONFIG, useValue: { apiBaseUrl: environment.apiBaseUrl } },
],
};
