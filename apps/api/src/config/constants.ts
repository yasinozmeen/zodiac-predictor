/**
 * Application configuration constants
 * Centralized configuration to avoid magic numbers throughout the codebase
 */

export const APP_CONFIG = {
  // Survey Configuration
  TOTAL_QUESTIONS: parseInt(process.env.TOTAL_QUESTIONS || '16'),
  MAX_SCORE_VALUE: 10,
  MIN_SCORE_VALUE: 1,

  // Session Configuration
  SESSION_EXPIRY_HOURS: parseInt(process.env.SESSION_EXPIRY_HOURS || '24'),
  SESSION_ID_PREFIX: 'session_',

  // Pagination Configuration
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,

  // Database Configuration
  DEFAULT_ORDER: 'created_at',
  DEFAULT_SORT_DIRECTION: 'desc' as const,

  // Validation Configuration
  MAX_BULK_OPERATIONS: parseInt(process.env.MAX_BULK_OPERATIONS || '100'),

  // Performance Configuration
  QUERY_TIMEOUT_MS: parseInt(process.env.QUERY_TIMEOUT_MS || '30000'),

  // Error Handling
  MAX_ERROR_MESSAGE_LENGTH: 500,
  INCLUDE_STACK_TRACE: process.env.NODE_ENV === 'development',
} as const

/**
 * Zodiac Signs Configuration
 */
export const ZODIAC_SIGNS = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number]

/**
 * API Response Messages
 */
export const RESPONSE_MESSAGES = {
  // Session Messages
  SESSION_CREATED: 'Session created successfully',
  SESSION_RETRIEVED: 'Session retrieved successfully',
  SESSION_UPDATED: 'Session updated successfully',
  SESSION_DELETED: 'Session deleted successfully',
  SESSION_NOT_FOUND: 'Session not found',
  SESSION_EXPIRED: 'Session has expired',
  SESSION_INVALID: 'Invalid session',

  // Response Messages
  RESPONSE_CREATED: 'Response created successfully',
  RESPONSE_UPDATED: 'Response updated successfully',
  RESPONSE_RETRIEVED: 'Response retrieved successfully',
  RESPONSE_DELETED: 'Response deleted successfully',
  RESPONSE_NOT_FOUND: 'Response not found',
  RESPONSE_VALIDATION_FAILED: 'Response validation failed',

  // General Messages
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_REQUEST: 'Invalid request data',
  OPERATION_SUCCESSFUL: 'Operation completed successfully',
  BULK_OPERATION_COMPLETED: 'Bulk operation completed',

  // Zodiac Messages
  ZODIAC_SCORES_CALCULATED: 'Zodiac scores calculated successfully',
  ZODIAC_CALCULATION_FAILED: 'Failed to calculate zodiac scores',
} as const

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  MULTI_STATUS: 207,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

/**
 * Database Table Names
 */
export const TABLES = {
  CATEGORIES: 'categories',
  QUESTIONS: 'questions',
  QUESTION_OPTIONS: 'question_options',
  USER_SESSIONS: 'user_sessions',
  USER_RESPONSES: 'user_responses',
  ZODIAC_SCORING: 'zodiac_scoring',
} as const

/**
 * Environment Configuration
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const
