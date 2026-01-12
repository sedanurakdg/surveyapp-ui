export type SurveyReportListItemDto = {
  surveyId: number;
  title: string;
  startsAtUtc: string;
  endsAtUtc: string;

  assignedCount: number;
  completedCount: number;
  pendingCount: number;
};

export type SurveyReportUsersResponseDto = {
  surveyId: number;
  title: string;
  users: SurveyReportUserListItemDto[];
};

export type SurveyReportUserListItemDto = {
  userId: number;
  email: string;
  completed: boolean;
  submittedAtUtc?: string | null;
};

export type SurveyReportUserAnswerDto = {
  questionId: number;
  questionText: string;
  selectedOptionIndex: number;
  selectedOptionText: string;
};

export type SurveyReportUserDetailDto = {
  surveyId: number;
  userId: number;
  email: string;
  submittedAtUtc?: string | null;
  answers: SurveyReportUserAnswerDto[];
};
