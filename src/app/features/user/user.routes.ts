import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-shell/user-shell.component').then(m => m.UserShellComponent),
    children: [
      {
        path: 'surveys',
        loadComponent: () =>
          import('./surveys/survey-list/user-survey-list.component').then(m => m.UserSurveyListComponent),
      },
      {
        path: 'surveys/:id',
        loadComponent: () =>
          import('./surveys/survey-detail/user-survey-detail.component').then(m => m.UserSurveyDetailComponent),
      },

      { path: '', pathMatch: 'full', redirectTo: 'surveys' },
    ],
  },
];
