import type { QuestionOption } from '@zodiac/shared'

export interface QuestionOptionModel extends QuestionOption {
  // Additional backend-specific properties if needed
}

export interface CreateQuestionOptionData {
  questionId: string
  optionText: string
  orderIndex: number
}

export interface UpdateQuestionOptionData {
  questionId?: string
  optionText?: string
  orderIndex?: number
}
