import type { Question, QuestionOption } from '@zodiac/shared'

export interface QuestionModel extends Question {
  // Additional backend-specific properties if needed
}

export interface QuestionWithOptions extends Question {
  options: QuestionOption[]
}

export interface CreateQuestionData {
  categoryId: string
  questionText: string
  orderIndex: number
}

export interface UpdateQuestionData {
  categoryId?: string
  questionText?: string
  orderIndex?: number
}
