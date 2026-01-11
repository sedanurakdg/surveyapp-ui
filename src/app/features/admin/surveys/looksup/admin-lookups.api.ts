import { endpoint } from '../../../../core/http/endpoint';

export type AdminQuestionListDto = {
  id: number;
  text: string;
  answerTemplateId: number;
  answerTemplateName: string;
  isActive: boolean;
};

export type AdminUserDto = {
  id: number;
  email: string;
  roles: string[];
};

export const AdminLookupsApi = {
  questions: endpoint<AdminQuestionListDto[]>('GET', '/api/admin/questions'),
  users: endpoint<AdminUserDto[]>('GET', '/api/admin/users'),
} as const;
