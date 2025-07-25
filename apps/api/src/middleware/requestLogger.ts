import { Request, Response, NextFunction } from 'express'
import { config } from '../utils/config.js'

interface RequestLogData {
  method: string
  url: string
  ip: string
  userAgent?: string
  timestamp: string
  duration?: number
  statusCode?: number
  requestId: string
}

/**
 * Enhanced request logging middleware
 * Provides detailed request/response logging for monitoring
 */
export function requestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()
    const requestId = generateRequestId()

    // Add request ID to request object for use in other middleware
    ;(req as any).requestId = requestId

    // Log incoming request
    const requestData: Partial<RequestLogData> = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
      requestId,
    }

    // Only log sensitive data in development
    if (config.nodeEnv === 'development') {
      console.log('🌐 Incoming Request:', {
        ...requestData,
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
        body: req.method !== 'GET' && req.body ? maskSensitiveData(req.body) : undefined,
      })
    } else {
      console.log('🌐 Incoming Request:', requestData)
    }

    // Capture response data
    const originalSend = res.json
    res.json = function (body: any) {
      const duration = Date.now() - startTime

      const responseData: RequestLogData = {
        ...requestData,
        duration,
        statusCode: res.statusCode,
      } as RequestLogData

      // Log response
      if (res.statusCode >= 400) {
        console.error('❌ Request Failed:', responseData)
      } else if (res.statusCode >= 300) {
        console.warn('⚠️  Request Redirected:', responseData)
      } else {
        console.log('✅ Request Completed:', responseData)
      }

      // Call original json method
      return originalSend.call(this, body)
    }

    next()
  }
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Mask sensitive data in logs
 */
function maskSensitiveData(data: any): any {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth']

  if (typeof data !== 'object' || data === null) {
    return data
  }

  const masked = { ...data }

  for (const key in masked) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      masked[key] = '***MASKED***'
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveData(masked[key])
    }
  }

  return masked
}

/**
 * Request timeout middleware
 */
export function requestTimeout(timeoutMs: number = 30000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        console.error(`⏱️  Request timeout: ${req.method} ${req.originalUrl}`)
        res.status(408).json({
          success: false,
          message: 'Request timeout',
          code: 'REQUEST_TIMEOUT',
          timestamp: new Date().toISOString(),
        })
      }
    }, timeoutMs)

    // Clear timeout when response is sent
    res.on('finish', () => {
      clearTimeout(timeout)
    })

    next()
  }
}
