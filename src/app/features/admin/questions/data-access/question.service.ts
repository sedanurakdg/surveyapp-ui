import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../../../../core/http/api-client';
import { QuestionApi } from './question.api';
import { CreateQuestionRequestDto, UpdateQuestionRequestDto } from '../models/question.models';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private api = inject(ApiClient);

  list() { return this.api.call(QuestionApi.list); }
  get(id: number) { return this.api.call(QuestionApi.get(id)); }
  create(req: CreateQuestionRequestDto) { return this.api.call(QuestionApi.create, req); }
  update(id: number, req: UpdateQuestionRequestDto) { return this.api.call(QuestionApi.update(id), req); }
  delete(id: number) { return this.api.call(QuestionApi.delete(id)); }
}
