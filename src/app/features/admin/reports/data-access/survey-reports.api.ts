import { endpoint } from '../../../../core/http/endpoint';
import {
  SurveyReportListItemDto,
  SurveyReportUserDetailDto,
  SurveyReportUserListItemDto,
  SurveyReportUsersResponseDto,
} from '../models/survey-report.models';

export const SurveyReportsApi = {
  list: endpoint<SurveyReportListItemDto[]>('GET', '/api/admin/reports/surveys'),

  users: (surveyId: number) =>
    endpoint<SurveyReportUsersResponseDto>('GET', `/api/admin/reports/surveys/${surveyId}/users`),

  userDetail: (surveyId: number, userId: number) =>
    endpoint<SurveyReportUserDetailDto>('GET', `/api/admin/reports/surveys/${surveyId}/users/${userId}`),
} as const;
