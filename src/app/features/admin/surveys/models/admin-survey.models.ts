export type AdminSurveyListItemDto = {
  id: number;
  title: string;
  description?: string | null;
  isActive: boolean;
  startsAtUtc: string;
  endsAtUtc: string;
};

export type AdminSurveyDetailDto = {
  id: number;
  title: string;
  description?: string | null;
  isActive: boolean;
  startsAtUtc: string;
  endsAtUtc: string;
  questions: { questionId: number; sortOrder: number }[];
  assignedUserIds: number[];
};

// Backend: CreateSurveyRequest
export type AdminSurveyCreateRequestDto = {
  title: string;
  description?: string | null;
  startsAtUtc: string;
  endsAtUtc: string;
  questionIds: number[];
  userIds: number[];
};

// Backend: UpdateSurveyRequest
export type AdminSurveyUpdateRequestDto = {
  title: string;
  description?: string | null;
  isActive: boolean;
  startsAtUtc: string;
  endsAtUtc: string;
  questionIds: number[];
  userIds: number[];
};

export type AdminSurveyCreateResponseDto = { id: number };
