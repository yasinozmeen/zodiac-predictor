import express from 'express'

export const notFoundHandler = (
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  })
}
