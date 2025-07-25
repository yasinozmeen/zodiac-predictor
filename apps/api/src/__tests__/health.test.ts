import request from 'supertest'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { errorHandler } from '../middleware/errorHandler.js'
import { notFoundHandler } from '../middleware/notFoundHandler.js'

// Create a test version of the app without starting the server
function createTestApp(): express.Application {
  const app = express()

  // Security middleware
  app.use(helmet())
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
  app.use(limiter)

  // General middleware
  app.use(compression() as any)
  app.use(morgan('combined'))
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))

  // Health check endpoint
  app.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'zodiac-predictor-api',
    })
  })

  // Error handling middleware
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

describe('Health Endpoint', () => {
  let app: express.Application

  beforeAll(() => {
    app = createTestApp()
  })

  describe('GET /health', () => {
    it('should return 200 status', async () => {
      const response = await request(app).get('/health').expect(200)

      expect(response.body).toHaveProperty('status', 'OK')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('service', 'zodiac-predictor-api')
      expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    })

    it('should have correct content type', async () => {
      const response = await request(app).get('/health').expect('Content-Type', /json/)

      expect(response.status).toBe(200)
    })
  })
})
