import request from 'supertest'
import express from 'express'
import { healthRouter } from '../../routes/health'

// Mock dependencies completely
jest.mock('../../utils/supabase', () => ({
  checkDatabaseConnection: jest.fn(),
}))

jest.mock('../../database/migrationRunner', () => ({
  checkTablesExist: jest.fn(),
}))

// Import mocked functions
const { checkDatabaseConnection } = require('../../utils/supabase')
const { checkTablesExist } = require('../../database/migrationRunner')

const mockCheckDatabaseConnection = checkDatabaseConnection
const mockCheckTablesExist = checkTablesExist

// Create test app
const app = express()
app.use('/health', healthRouter)

describe('Health Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /health', () => {
    it('should return healthy status when all services are working', async () => {
      mockCheckDatabaseConnection.mockResolvedValue(true)
      mockCheckTablesExist.mockResolvedValue({
        categories: true,
        questions: true,
        question_options: true,
      })

      const response = await request(app).get('/health')

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        status: 'healthy',
        services: {
          database: {
            status: 'connected',
            tables: {
              categories: true,
              questions: true,
              question_options: true,
            },
          },
          api: {
            status: 'running',
            version: '1.0.0',
          },
        },
      })
      expect(response.body.timestamp).toBeDefined()
      expect(response.body.responseTime).toMatch(/\d+ms/)
    })

    it('should return unhealthy status when database is down', async () => {
      mockCheckDatabaseConnection.mockResolvedValue(false)
      mockCheckTablesExist.mockResolvedValue({
        categories: false,
        questions: false,
        question_options: false,
      })

      const response = await request(app).get('/health')

      expect(response.status).toBe(503)
      expect(response.body).toMatchObject({
        status: 'unhealthy',
        services: {
          database: {
            status: 'disconnected',
            tables: {
              categories: false,
              questions: false,
              question_options: false,
            },
          },
          api: {
            status: 'running',
          },
        },
      })
    })

    it('should return error status when health check throws', async () => {
      mockCheckDatabaseConnection.mockRejectedValue(new Error('Connection failed'))

      const response = await request(app).get('/health')

      expect(response.status).toBe(503)
      expect(response.body).toMatchObject({
        status: 'unhealthy',
        error: 'Connection failed',
        services: {
          database: { status: 'error' },
          api: { status: 'running' },
        },
      })
    })

    it('should include environment information', async () => {
      process.env.NODE_ENV = 'test'

      mockCheckDatabaseConnection.mockResolvedValue(true)
      mockCheckTablesExist.mockResolvedValue({
        categories: true,
        questions: true,
        question_options: true,
      })

      const response = await request(app).get('/health')

      expect(response.status).toBe(200)
      expect(response.body.environment).toBe('test')
    })
  })
})
