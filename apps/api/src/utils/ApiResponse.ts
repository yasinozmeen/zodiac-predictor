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
   * Send updated response
   */
  static updated<T>(res: Response, data: T, message: string): Response {
    return this.success(res, data, message, 200)
  }

  /**
   * Send deleted response
   */
  static deleted(res: Response, message: string = 'Resource deleted successfully'): Response {
    return this.success(res, null, message, 200)
  }

  /**
   * Send paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Data retrieved successfully'
  ): Response {
    const totalPages = Math.ceil(total / limit)

    const response = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }

    return res.status(200).json(response)
  }

  /**
   * Send multi-status response (for bulk operations)
   */
  static multiStatus<T>(res: Response, data: T, message: string): Response {
    return this.success(res, data, message, 207)
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(res: Response, message: string = 'Unauthorized access'): Response {
    return this.error(res, message, 401)
  }

  /**
   * Send forbidden response
   */
  static forbidden(res: Response, message: string = 'Access forbidden'): Response {
    return this.error(res, message, 403)
  }

  /**
   * Send conflict response
   */
  static conflict(res: Response, message: string, details?: Record<string, unknown>): Response {
    return this.error(res, message, 409, undefined, details)
  }

  /**
   * Send too many requests response
   */
  static tooManyRequests(res: Response, message: string = 'Too many requests'): Response {
    return this.error(res, message, 429)
  }

  /**
   * Send internal server error response
   */
  static internalError(
    res: Response,
    message: string = 'Internal server error',
    error?: any
  ): Response {
    return this.error(res, message, 500, error)
  }
}
