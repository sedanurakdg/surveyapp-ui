import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./admin-shell/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      {
        path: 'surveys',
        loadComponent: () =>
          import('./surveys/survey-list/admin-survey-list.component').then(
            (m) => m.AdminSurveyListComponent,
          ),
      },
      {
        path: 'surveys/new',
        loadComponent: () =>
          import('./surveys/survey-form/admin-survey-form.component').then(
            (m) => m.AdminSurveyFormComponent,
          ),
      },
      {
        path: 'surveys/:id',
        loadComponent: () =>
          import('./surveys/survey-detail/admin-survey-detail.component').then(
            (m) => m.AdminSurveyDetailComponent,
          ),
      },
      {
        path: 'surveys/:id/edit',
        loadComponent: () =>
          import('./surveys/survey-form/admin-survey-form.component').then(
            (m) => m.AdminSurveyFormComponent,
          ),
      },

      { path: '', pathMatch: 'full', redirectTo: 'surveys' },
    ],
  },
];
