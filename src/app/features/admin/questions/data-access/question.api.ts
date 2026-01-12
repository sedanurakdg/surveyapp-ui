import { endpoint } from '../../../../core/http/endpoint';
import {
  CreateQuestionRequestDto,
  QuestionDetailDto,
  QuestionListDto,
  UpdateQuestionRequestDto,
} from '../models/question.models';

export const QuestionApi = {
  list: endpoint<QuestionListDto[]>('GET', '/api/admin/questions'),
  get: (id: number) => endpoint<QuestionDetailDto>('GET', `/api/admin/questions/${id}`),

  create: endpoint<{ id: number }, CreateQuestionRequestDto>('POST', '/api/admin/questions'),
  update: (id: number) => endpoint<void, UpdateQuestionRequestDto>('PUT', `/api/admin/questions/${id}`),
  delete: (id: number) => endpoint<void>('DELETE', `/api/admin/questions/${id}`),
} as const;
