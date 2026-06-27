/**
 * Security Service for handling sensitive operations
 * Implements security best practices and input validation
 */

import crypto from 'crypto'

export class SecurityService {
  private static readonly SENSITIVE_PATTERNS = [
    /password/i,
    /secret/i,
    /token/i,
    /key/i,
    /auth/i,
    /credential/i,
  ]

  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ]

  /**
   * Sanitize sensitive data for logging
   */
  static sanitizeForLogging(data: any): any {
    if (typeof data === 'string') {
      return this.SENSITIVE_PATTERNS.some(pattern => pattern.test(data)) ? '[REDACTED]' : data
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {}

      for (const [key, value] of Object.entries(data)) {
        const keyContainsSensitive = this.SENSITIVE_PATTERNS.some(pattern => pattern.test(key))

        sanitized[key] = keyContainsSensitive ? '[REDACTED]' : this.sanitizeForLogging(value)
      }

      return sanitized
    }

    return data
  }

  /**
   * Validate and sanitize user input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string')
    }

    let sanitized = input

    // Remove potential XSS patterns
    this.XSS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '')
    })

    // Encode HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')

    return sanitized.trim()
  }

  /**
   * Generate cryptographically secure random string
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Hash sensitive data using crypto
   */
  static hashSensitiveData(data: string, salt?: string): { hash: string; salt: string } {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(data, actualSalt, 10000, 64, 'sha512').toString('hex')

    return { hash, salt: actualSalt }
  }

  /**
   * Verify hashed data
   */
  static verifyHashedData(data: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hashSensitiveData(data, salt)
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash))
  }

  /**
   * Rate limiting key generation
   */
  static generateRateLimitKey(req: { ip?: string; user?: { id: string } }): string {
    return req.user?.id || req.ip || 'anonymous'
  }

  /**
   * Validate birth date input
   */
  static validateBirthDate(birthDate: string): boolean {
    const date = new Date(birthDate)
    const now = new Date()
    const minDate = new Date('1900-01-01')

    return !isNaN(date.getTime()) && date <= now && date >= minDate
  }

  /**
   * Validate location input
   */
  static validateLocation(location: string): boolean {
    // Basic validation for location string
    const sanitized = this.sanitizeInput(location)
    return sanitized.length > 0 && sanitized.length <= 100 && /^[a-zA-Z0-9\s,.-]+$/.test(sanitized)
  }

  /**
   * Check if request is from trusted source
   */
  static isTrustedOrigin(origin: string, allowedOrigins: string[]): boolean {
    if (!origin) return false
    return allowedOrigins.includes(origin)
  }

  /**
   * Mask sensitive information for display
   */
  static maskSensitiveInfo(value: string, visibleChars: number = 4): string {
    if (value.length <= visibleChars) {
      return '*'.repeat(value.length)
    }

    const visible = value.slice(-visibleChars)
    const masked = '*'.repeat(value.length - visibleChars)
    return masked + visible
  }
}
