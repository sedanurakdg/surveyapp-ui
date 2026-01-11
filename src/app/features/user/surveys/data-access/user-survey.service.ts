import { Injectable } from '@angular/core';
import { ApiClient } from '../../../../core/http/api-client';
import { UserSurveyApi } from './user-survey.api';
import { SubmitSurveyRequest } from '../models/user-survey.models';

@Injectable({ providedIn: 'root' })
export class UserSurveyService {
  constructor(private api: ApiClient) {}

  list() {
    return this.api.call(UserSurveyApi.list);
  }

  get(id: number) {
    return this.api.call(UserSurveyApi.get(id));
  }

  submit(id: number, body: SubmitSurveyRequest) {
    return this.api.call(UserSurveyApi.submit(id), body);
  }
}
