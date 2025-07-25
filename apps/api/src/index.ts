import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'
import apiRouter from './routes/index.js'
import { config, validateConfig } from './utils/config.js'

// Validate environment configuration on startup
validateConfig()

const app = express()

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
)

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Rate limiting with configurable values
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// General middleware
app.use(compression() as any)
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Basic health check endpoint (detailed health check at /api/v1/health)
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'zodiac-predictor-api',
    version: '1.0.0',
    uptime: process.uptime(),
  })
})

// API routes
app.use('/api/v1', apiRouter)

// Error handling middleware
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 Zodiac Predictor API server running on port ${config.port}`)
  console.log(`📡 Environment: ${config.nodeEnv}`)
  console.log(`🔗 CORS Origin: ${config.frontendUrl}`)
  console.log(
    `⚡ Rate Limit: ${config.rateLimit.maxRequests} req/${config.rateLimit.windowMs / 1000 / 60}min`
  )
})

// Graceful shutdown handling
function gracefulShutdown(signal: string) {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`)

  server.close((err: any) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err)
      process.exit(1)
    }
    console.log('✅ Server closed successfully')
    process.exit(0)
  })
}

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

export default app
