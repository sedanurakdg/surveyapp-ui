export type AnswerOptionDto = {
  id?: number | null;       // backend: long? Id
  text: string;
  sortOrder: number;        // backend: short
};

export type AnswerTemplateListDto = {
  id: number;
  name: string;
  isActive: boolean;
  optionCount: number;
};

export type AnswerTemplateDetailDto = {
  id: number;
  name: string;
  isActive: boolean;
  options: AnswerOptionDto[];
};

export type CreateAnswerTemplateRequestDto = {
  name: string;
  options: AnswerOptionDto[];
};

export type UpdateAnswerTemplateRequestDto = {
  name: string;
  isActive: boolean;
  options: AnswerOptionDto[];
};
