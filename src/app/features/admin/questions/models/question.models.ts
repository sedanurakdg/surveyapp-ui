export type QuestionListDto = {
  id: number;
  text: string;
  answerTemplateId: number;
  answerTemplateName: string;
  isActive: boolean;
};

export type QuestionDetailDto = {
  id: number;
  text: string;
  answerTemplateId: number;
  answerTemplateName: string;
  isActive: boolean;
};

export type CreateQuestionRequestDto = {
  text: string;
  answerTemplateId: number;
};

export type UpdateQuestionRequestDto = {
  text: string;
  answerTemplateId: number;
  isActive: boolean;
};
