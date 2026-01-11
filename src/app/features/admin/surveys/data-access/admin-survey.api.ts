import { endpoint } from '../../../../core/http/endpoint';
import {
  AdminSurveyCreateRequestDto,
  AdminSurveyCreateResponseDto,
  AdminSurveyDetailDto,
  AdminSurveyListItemDto,
  AdminSurveyUpdateRequestDto,
} from '../models/admin-survey.models';

export const AdminSurveyApi = {
  list: endpoint<AdminSurveyListItemDto[]>('GET', '/api/admin/surveys'),
  get: (id: number) => endpoint<AdminSurveyDetailDto>('GET', `/api/admin/surveys/${id}`),

  create: endpoint<AdminSurveyCreateResponseDto, AdminSurveyCreateRequestDto>('POST', '/api/admin/surveys'),
  update: (id: number) => endpoint<void, AdminSurveyUpdateRequestDto>('PUT', `/api/admin/surveys/${id}`),

  delete: (id: number) => endpoint<void>('DELETE', `/api/admin/surveys/${id}`),
} as const;
