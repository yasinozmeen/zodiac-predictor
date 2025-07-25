import { Response } from 'express'

/**
 * Standardized API response utility class
 * Provides consistent response formatting across all controllers
 */
export class ApiResponse {
  /**
   * Send successful response
   */
  static success<T>(res: Response, data: T, message: string, statusCode: number = 200): Response {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    error?: any,
    details?: any
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error?.message,
      details,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Send validation error response
   */
  static validationError(res: Response, message: string, validation?: any): Response {
    return res.status(400).json({
      success: false,
      message,
      validation,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Send not found response
   */
  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Send created response
   */
  static created<T>(res: Response, data: T, message: string): Response {
    return this.success(res, data, message, 201)
  }

  /**
   * Send multi-status response (for bulk operations)
   */
  static multiStatus<T>(res: Response, data: T, message: string): Response {
    return this.success(res, data, message, 207)
  }
}
