import type { ZodiacScoring } from '@zodiac/shared'

export interface ZodiacScoringModel extends ZodiacScoring {
  // Additional backend-specific properties if needed
}

export interface CreateZodiacScoringData {
  questionOptionId: string
  zodiacSign: string
  scoreValue: number
}

export interface UpdateZodiacScoringData {
  zodiacSign?: string
  scoreValue?: number
}

export interface ZodiacScoringWithOption extends ZodiacScoring {
  questionOption: {
    id: string
    questionId: string
    optionText: string
    orderIndex: number
  }
}

// Zodiac sign enum for better type safety and IDE support
export enum ZodiacSign {
  ARIES = 'aries',
  TAURUS = 'taurus',
  GEMINI = 'gemini',
  CANCER = 'cancer',
  LEO = 'leo',
  VIRGO = 'virgo',
  LIBRA = 'libra',
  SCORPIO = 'scorpio',
  SAGITTARIUS = 'sagittarius',
  CAPRICORN = 'capricorn',
  AQUARIUS = 'aquarius',
  PISCES = 'pisces',
}

// Type alias for compatibility
export type ZodiacSignType = ZodiacSign

// Score calculation result
export interface ZodiacScoreResult {
  zodiacSign: ZodiacSignType
  totalScore: number
  confidence: number
}

export interface ZodiacCalculationResult {
  predictedSign: ZodiacSignType
  scores: Record<ZodiacSignType, number>
  confidence: number
  sessionId: string
}
