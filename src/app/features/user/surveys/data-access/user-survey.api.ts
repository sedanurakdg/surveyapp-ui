import { endpoint } from '../../../../core/http/endpoint';
import { SubmitSurveyRequest, UserSurveyDetailDto, UserSurveyListDto } from '../models/user-survey.models';

export const UserSurveyApi = {
  list: endpoint<UserSurveyListDto[]>('GET', '/api/user/surveys'),
  get: (id: number) => endpoint<UserSurveyDetailDto>('GET', `/api/user/surveys/${id}`),
  submit: (id: number) => endpoint<{ status: string }, SubmitSurveyRequest>('POST', `/api/user/surveys/${id}/submit`),
};
