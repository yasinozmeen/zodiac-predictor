import type { UserSession } from '@zodiac/shared'

export interface UserSessionModel {
  id: string
  sessionId: string
  ipAddress?: string
  userAgent?: string
  progressData: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface CreateUserSessionData {
  sessionId: string
  ipAddress?: string
  userAgent?: string
  progressData?: Record<string, any>
}

export interface UpdateUserSessionData {
  progressData?: Record<string, any>
  updatedAt?: string
}

export interface UserSessionWithResponses extends UserSession {
  responses: {
    id: string
    questionId: string
    selectedOptionId: string
    answeredAt: string
  }[]
}

// Session progress tracking
export interface SessionProgress {
  currentCategoryId?: string
  currentQuestionIndex: number
  totalQuestions: number
  completedQuestions: string[]
  startedAt: string
  lastActivityAt: string
}

// Session statistics
export interface SessionStats {
  sessionId: string
  totalResponses: number
  completionPercentage: number
  timeSpent?: number // in seconds
  isCompleted: boolean
  createdAt: string
  completedAt?: string
}

// Session validation result
export interface SessionValidation {
  isValid: boolean
  exists: boolean
  isExpired: boolean
  canContinue: boolean
  message?: string
}
