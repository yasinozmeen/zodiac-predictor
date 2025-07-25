import express from 'express'

export const notFoundHandler = (
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): void => {
  // Log the 404 for monitoring
  console.warn('404 Not Found:', {
    url: req.originalUrl,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    timestamp: new Date().toISOString(),
  })

  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      health: '/health',
      api: '/api/v1',
      healthDetailed: '/api/v1/health',
    },
  })
}
