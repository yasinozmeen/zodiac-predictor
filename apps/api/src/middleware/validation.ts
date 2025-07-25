import { Request, Response, NextFunction } from 'express'

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const validateUUID = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.params[paramName]

    if (!value || !UUID_REGEX.test(value)) {
      res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
        error: `${paramName} must be a valid UUID`,
        timestamp: new Date().toISOString(),
      })
      return
    }

    next()
  }
}

export const validateCategoryData = (req: Request, res: Response, next: NextFunction): void => {
  const { name, orderIndex } = req.body
  const errors: string[] = []

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string')
  }

  if (name && name.length > 100) {
    errors.push('Name must be 100 characters or less')
  }

  if (orderIndex === undefined || typeof orderIndex !== 'number' || orderIndex < 0) {
    errors.push('Order index is required and must be a non-negative number')
  }

  if (req.body.description && typeof req.body.description !== 'string') {
    errors.push('Description must be a string')
  }

  if (
    req.body.iconName &&
    (typeof req.body.iconName !== 'string' || req.body.iconName.length > 50)
  ) {
    errors.push('Icon name must be a string of 50 characters or less')
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString(),
    })
    return
  }

  next()
}

export const validateQuestionData = (req: Request, res: Response, next: NextFunction): void => {
  const { categoryId, questionText, orderIndex } = req.body
  const errors: string[] = []

  if (!categoryId || !UUID_REGEX.test(categoryId)) {
    errors.push('Category ID is required and must be a valid UUID')
  }

  if (!questionText || typeof questionText !== 'string' || questionText.trim().length === 0) {
    errors.push('Question text is required and must be a non-empty string')
  }

  if (orderIndex === undefined || typeof orderIndex !== 'number' || orderIndex < 0) {
    errors.push('Order index is required and must be a non-negative number')
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString(),
    })
    return
  }

  next()
}

export const validateQuestionOptionData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { questionId, optionText, orderIndex } = req.body
  const errors: string[] = []

  if (!questionId || !UUID_REGEX.test(questionId)) {
    errors.push('Question ID is required and must be a valid UUID')
  }

  if (!optionText || typeof optionText !== 'string' || optionText.trim().length === 0) {
    errors.push('Option text is required and must be a non-empty string')
  }

  if (orderIndex === undefined || typeof orderIndex !== 'number' || orderIndex < 0) {
    errors.push('Order index is required and must be a non-negative number')
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString(),
    })
    return
  }

  next()
}
