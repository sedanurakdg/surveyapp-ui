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
      {
        path: 'reports/surveys',
        loadComponent: () =>
          import('./reports/report-survey-list/report-survey-list.component').then(
            (m) => m.ReportSurveyListComponent,
          ),
      },
      {
        path: 'reports/surveys/:surveyId/users',
        loadComponent: () =>
          import('./reports/report-survey-users/report-survey-users.component').then(
            (m) => m.ReportSurveyUsersComponent,
          ),
      },
      {
        path: 'reports/surveys/:surveyId/users/:userId',
        loadComponent: () =>
          import('./reports/report-user-answers/report-user-answers.component').then(
            (m) => m.ReportUserAnswersComponent,
          ),
      },
      // Answer Templates
      {
        path: 'answer-templates',
        loadComponent: () =>
          import('./answer-templates/template-list/template-list.component').then(
            (m) => m.TemplateListComponent,
          ),
      },
      {
        path: 'answer-templates/new',
        loadComponent: () =>
          import('./answer-templates/template-form/template-form.component').then(
            (m) => m.TemplateFormComponent,
          ),
      },
      {
        path: 'answer-templates/:id/edit',
        loadComponent: () =>
          import('./answer-templates/template-form/template-form.component').then(
            (m) => m.TemplateFormComponent,
          ),
      },

      // Questions
      {
        path: 'questions',
        loadComponent: () =>
          import('./questions/question-list/question-list.component').then(
            (m) => m.QuestionListComponent,
          ),
      },
      {
        path: 'questions/new',
        loadComponent: () =>
          import('./questions/question-form/question-form.component').then(
            (m) => m.QuestionFormComponent,
          ),
      },
      {
        path: 'questions/:id/edit',
        loadComponent: () =>
          import('./questions/question-form/question-form.component').then(
            (m) => m.QuestionFormComponent,
          ),
      },

      { path: '', pathMatch: 'full', redirectTo: 'surveys' },
    ],
  },
];
