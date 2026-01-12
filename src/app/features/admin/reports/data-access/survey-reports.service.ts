import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../../../../core/http/api-client';
import { SurveyReportsApi } from './survey-reports.api';

@Injectable({ providedIn: 'root' })
export class SurveyReportsService {
  private api = inject(ApiClient);

  list(search?: string) {
    return this.api.call(SurveyReportsApi.list, undefined, { search });
  }

  users(surveyId: number, search?: string) {
    return this.api.call(SurveyReportsApi.users(surveyId), undefined, { search });
  }

  userDetail(surveyId: number, userId: number) {
    return this.api.call(SurveyReportsApi.userDetail(surveyId, userId));
  }
}
