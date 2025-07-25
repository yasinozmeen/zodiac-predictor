import { Request, Response, NextFunction } from 'express'

export interface DatabaseError extends Error {
  code?: string
  details?: string
  hint?: string
}

export const databaseErrorHandler = (
  error: DatabaseError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Database error occurred:', {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  })

  // Handle common Supabase/PostgreSQL errors
  switch (error.code) {
    case 'PGRST116':
      res.status(404).json({
        success: false,
        message: 'Resource not found',
        error: 'The requested resource does not exist',
        timestamp: new Date().toISOString(),
      })
      break

    case 'PGRST106':
      res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        error: 'The request contains invalid or missing parameters',
        timestamp: new Date().toISOString(),
      })
      break

    case '23505': // Unique constraint violation
      res.status(409).json({
        success: false,
        message: 'Resource already exists',
        error: 'A resource with these values already exists',
        timestamp: new Date().toISOString(),
      })
      break

    case '23503': // Foreign key constraint violation
      res.status(400).json({
        success: false,
        message: 'Invalid reference',
        error: 'Referenced resource does not exist',
        timestamp: new Date().toISOString(),
      })
      break

    case '23502': // Not null constraint violation
      res.status(400).json({
        success: false,
        message: 'Missing required field',
        error: 'One or more required fields are missing',
        timestamp: new Date().toISOString(),
      })
      break

    case 'PGRST301': // Connection error
      res.status(503).json({
        success: false,
        message: 'Database connection error',
        error: 'Unable to connect to the database',
        timestamp: new Date().toISOString(),
      })
      break

    default:
      // Pass to general error handler
      next(error)
      break
  }
}

// Utility function to create database-specific errors
export const createDatabaseError = (
  message: string,
  code?: string,
  details?: string
): DatabaseError => {
  const error = new Error(message) as DatabaseError
  error.code = code
  error.details = details
  return error
}
