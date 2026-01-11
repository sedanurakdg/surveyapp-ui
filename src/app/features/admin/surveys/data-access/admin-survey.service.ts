import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../../../../core/http/api-client';
import { AdminSurveyApi } from './admin-survey.api';
import { AdminSurveyCreateRequestDto, AdminSurveyUpdateRequestDto } from '../models/admin-survey.models';

@Injectable({ providedIn: 'root' })
export class AdminSurveyService {
  private api = inject(ApiClient);

  list() {
    return this.api.call(AdminSurveyApi.list);
  }

  get(id: number) {
    return this.api.call(AdminSurveyApi.get(id));
  }

  create(req: AdminSurveyCreateRequestDto) {
    return this.api.call(AdminSurveyApi.create, req);
  }

  update(id: number, req: AdminSurveyUpdateRequestDto) {
    return this.api.call(AdminSurveyApi.update(id), req);
  }

  delete(id: number) {
    return this.api.call(AdminSurveyApi.delete(id));
  }
}
