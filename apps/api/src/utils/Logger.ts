/**
 * Production-ready Logger Service
 * Replaces console.log/error with structured logging
 */

import { SecurityService } from '../security/SecurityService.js'

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  timestamp: string
  level: string
  message: string
  meta?: any
  requestId?: string
  userId?: string
}

export class Logger {
  private static instance: Logger
  private logLevel: LogLevel
  private isDevelopment: boolean

  private constructor() {
    this.logLevel = this.getLogLevelFromEnv()
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase() || 'INFO'
    switch (level) {
      case 'ERROR':
        return LogLevel.ERROR
      case 'WARN':
        return LogLevel.WARN
      case 'INFO':
        return LogLevel.INFO
      case 'DEBUG':
        return LogLevel.DEBUG
      default:
        return LogLevel.INFO
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  private formatLogEntry(
    level: LogLevel,
    message: string,
    meta?: any,
    context?: { requestId?: string; userId?: string }
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      message,
      meta: meta ? SecurityService.sanitizeForLogging(meta) : undefined,
      requestId: context?.requestId,
      userId: context?.userId,
    }
  }

  private writeLog(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Pretty print for development
      const { level, message, meta, timestamp } = entry
      const coloredLevel = this.colorizeLevel(level)
      console.log(`[${timestamp}] ${coloredLevel} ${message}`)
      if (meta) {
        console.log('  Meta:', JSON.stringify(meta, null, 2))
      }
    } else {
      // JSON format for production (better for log aggregation)
      console.log(JSON.stringify(entry))
    }
  }

  private colorizeLevel(level: string): string {
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m', // Yellow
      INFO: '\x1b[36m', // Cyan
      DEBUG: '\x1b[90m', // Gray
    }
    const reset = '\x1b[0m'
    return `${colors[level as keyof typeof colors] || ''}${level}${reset}`
  }

  error(message: string, meta?: any, context?: { requestId?: string; userId?: string }): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.formatLogEntry(LogLevel.ERROR, message, meta, context)
      this.writeLog(entry)
    }
  }

  warn(message: string, meta?: any, context?: { requestId?: string; userId?: string }): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.formatLogEntry(LogLevel.WARN, message, meta, context)
      this.writeLog(entry)
    }
  }

  info(message: string, meta?: any, context?: { requestId?: string; userId?: string }): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.formatLogEntry(LogLevel.INFO, message, meta, context)
      this.writeLog(entry)
    }
  }

  debug(message: string, meta?: any, context?: { requestId?: string; userId?: string }): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.formatLogEntry(LogLevel.DEBUG, message, meta, context)
      this.writeLog(entry)
    }
  }

  // Specific methods for common use cases
  httpRequest(req: any, context?: { requestId?: string }): void {
    this.info(
      'HTTP Request',
      {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      },
      context
    )
  }

  httpResponse(res: any, duration: number, context?: { requestId?: string }): void {
    const level = res.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO

    if (this.shouldLog(level)) {
      const message = res.statusCode >= 400 ? 'HTTP Request Failed' : 'HTTP Request Completed'
      const entry = this.formatLogEntry(
        level,
        message,
        {
          statusCode: res.statusCode,
          duration: `${duration}ms`,
        },
        context
      )
      this.writeLog(entry)
    }
  }

  databaseQuery(query: string, duration: number, context?: { requestId?: string }): void {
    this.debug(
      'Database Query',
      {
        query: query.length > 100 ? query.substring(0, 100) + '...' : query,
        duration: `${duration}ms`,
      },
      context
    )
  }

  securityEvent(
    event: string,
    meta?: any,
    context?: { requestId?: string; userId?: string }
  ): void {
    this.warn(`Security Event: ${event}`, meta, context)
  }

  applicationStart(port: number, environment: string): void {
    this.info('Application Started', {
      port,
      environment,
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    })
  }

  applicationShutdown(signal: string): void {
    this.info('Application Shutdown', {
      signal,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  }
}

// Export singleton instance for easy use
export const logger = Logger.getInstance()

// Helper function for backward compatibility
export function replaceConsoleLogging(): void {
  if (process.env.NODE_ENV === 'production') {
    console.log = (...args: any[]) => logger.info(args.join(' '))
    console.error = (...args: any[]) => logger.error(args.join(' '))
    console.warn = (...args: any[]) => logger.warn(args.join(' '))
  }
}
