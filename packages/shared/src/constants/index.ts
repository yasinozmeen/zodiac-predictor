// Zodiac constants
export const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const

export const ZODIAC_ELEMENTS = ['Fire', 'Earth', 'Air', 'Water'] as const

export const ZODIAC_SYMBOLS = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
} as const

// API constants
export const API_ENDPOINTS = {
  ZODIAC: '/api/zodiac',
  SURVEY: '/api/survey',
  HEALTH: '/health',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Application constants
export const APP_CONFIG = {
  NAME: 'Zodiac Predictor',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered zodiac compatibility and personality prediction application',
} as const

// Survey constants
export const SURVEY_STEPS = {
  BIRTH_INFO: 1,
  PERSONALITY: 2,
  INTERESTS: 3,
} as const

export const INTEREST_OPTIONS = [
  'Art',
  'Music',
  'Sports',
  'Travel',
  'Technology',
  'Books',
  'Nature',
  'Food',
  'Movies',
  'Gaming',
  'Fashion',
  'Science',
] as const
