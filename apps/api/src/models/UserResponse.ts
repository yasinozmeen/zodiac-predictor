import type { UserResponse } from '@zodiac/shared'

export interface UserResponseModel {
  id: string
  sessionId: string
  questionId: string
  selectedOptionId: string
  answeredAt: string
}

export interface CreateUserResponseData {
  sessionId: string
  questionId: string
  selectedOptionId: string
}

export interface UpdateUserResponseData {
  selectedOptionId?: string
  answeredAt?: string
}

export interface UserResponseWithDetails extends UserResponse {
  question: {
    id: string
    categoryId: string
    questionText: string
    orderIndex: number
  }
  selectedOption: {
    id: string
    optionText: string
    orderIndex: number
  }
  zodiacScoring?: {
    id: string
    zodiacSign: string
    scoreValue: number
  }[]
}

// Bulk response operations
export interface BulkResponseData {
  sessionId: string
  responses: {
    questionId: string
    selectedOptionId: string
  }[]
}

export interface BulkResponseResult {
  successful: UserResponse[]
  failed: {
    questionId: string
    selectedOptionId: string
    error: string
  }[]
  totalProcessed: number
}

// Response validation
export interface ResponseValidation {
  isValid: boolean
  questionExists: boolean
  optionExists: boolean
  optionBelongsToQuestion: boolean
  sessionExists: boolean
  alreadyAnswered: boolean
  message?: string
}

// Response statistics
export interface ResponseStats {
  sessionId: string
  totalResponses: number
  responsesByCategory: Record<string, number>
  responsesByZodiacSign: Record<string, number>
  averageResponseTime?: number
  completionRate: number
}
