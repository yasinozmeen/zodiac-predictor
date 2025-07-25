// Zodiac related types
export interface ZodiacSign {
  name: string
  symbol: string
  element: 'Fire' | 'Earth' | 'Air' | 'Water'
  dates: {
    start: string // MM-DD format
    end: string // MM-DD format
  }
}

export interface CompatibilityResult {
  sign1: string
  sign2: string
  percentage: number
  description: string
}

export interface PersonalityAnalysis {
  zodiacSign: string
  element: string
  traits: string[]
  strengths: string[]
  challenges: string[]
  compatibility: CompatibilityResult[]
}

// Survey related types - New Structure
export interface Category {
  id: string
  name: string
  description: string | null
  orderIndex: number
  iconName: string | null
  createdAt: string
}

export interface Question {
  id: string
  categoryId: string
  questionText: string
  orderIndex: number
  createdAt: string
  options?: QuestionOption[]
}

export interface QuestionOption {
  id: string
  questionId: string
  optionText: string
  orderIndex: number
}

// Legacy UserResponse (kept for backward compatibility)
export interface LegacyUserResponse {
  questionId: string
  selectedOptionId: string
  answeredAt: Date
}

// Legacy survey types (kept for compatibility)
export interface SurveyData {
  birthDate: string
  birthTime?: string
  birthLocation: string
  personality?: string
  interests?: string[]
}

export interface SurveyResult {
  id: string
  timestamp: string
  surveyData: SurveyData
  personalityAnalysis: PersonalityAnalysis
  recommendations: string[]
  insights: string[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  timestamp?: string
}

export interface ApiError {
  success: false
  message: string
  stack?: string
  timestamp: string
}

// User related types (for future use)
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

// Session Management Types (Updated for Story 1.2B)
export interface UserSession {
  id: string
  sessionId: string
  ipAddress?: string
  userAgent?: string
  progressData: Record<string, any>
  createdAt: string
  updatedAt: string
}

// User Response Types
export interface UserResponse {
  id: string
  sessionId: string
  questionId: string
  selectedOptionId: string
  answeredAt: string
}

// Zodiac Scoring Types
export interface ZodiacScoring {
  id: string
  questionOptionId: string
  zodiacSign: string
  scoreValue: number
}

// Session-based User Response (replaces old UserResponse)
export interface SessionUserResponse {
  questionId: string
  selectedOptionId: string
  answeredAt: Date
}
