import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../../../../core/http/api-client';
import { AnswerTemplateApi } from './answer-template.api';
import { CreateAnswerTemplateRequestDto, UpdateAnswerTemplateRequestDto } from '../models/answer-template.models';

@Injectable({ providedIn: 'root' })
export class AnswerTemplateService {
  private api = inject(ApiClient);

  list() { return this.api.call(AnswerTemplateApi.list); }
  get(id: number) { return this.api.call(AnswerTemplateApi.get(id)); }
  create(req: CreateAnswerTemplateRequestDto) { return this.api.call(AnswerTemplateApi.create, req); }
  update(id: number, req: UpdateAnswerTemplateRequestDto) { return this.api.call(AnswerTemplateApi.update(id), req); }
  delete(id: number) { return this.api.call(AnswerTemplateApi.delete(id)); }
}
