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

// Survey related types
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

export interface UserSession {
  userId: string
  token: string
  expiresAt: string
}
