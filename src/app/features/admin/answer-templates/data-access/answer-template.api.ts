import { endpoint } from '../../../../core/http/endpoint';
import {
  AnswerTemplateDetailDto,
  AnswerTemplateListDto,
  CreateAnswerTemplateRequestDto,
  UpdateAnswerTemplateRequestDto,
} from '../models/answer-template.models';

export const AnswerTemplateApi = {
  list: endpoint<AnswerTemplateListDto[]>('GET', '/api/admin/answer-templates'),
  get: (id: number) => endpoint<AnswerTemplateDetailDto>('GET', `/api/admin/answer-templates/${id}`),

  create: endpoint<{ id: number }, CreateAnswerTemplateRequestDto>('POST', '/api/admin/answer-templates'),
  update: (id: number) => endpoint<void, UpdateAnswerTemplateRequestDto>('PUT', `/api/admin/answer-templates/${id}`),
  delete: (id: number) => endpoint<void>('DELETE', `/api/admin/answer-templates/${id}`),
} as const;
