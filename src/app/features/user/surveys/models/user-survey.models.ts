export interface UserSurveyListDto {
  id: number;
  title: string;
  startsAtUtc: string;
  endsAtUtc: string;
  isSubmitted: boolean;
}

export interface ChoiceDto {
  index: number;
  text: string;
}

export interface FillQuestionDto {
  questionId: number;
  text: string;
  choices: ChoiceDto[];
}

export interface UserSurveyDetailDto {
  id: number;
  title: string;
  description?: string | null;
  startsAtUtc: string;
  endsAtUtc: string;
  questions: FillQuestionDto[];
}

export interface SubmitAnswerDto {
  questionId: number;
  selectedOptionIndex: number;
}

export interface SubmitSurveyRequest {
  answers: SubmitAnswerDto[];
}
