import { Router } from 'express'
import { checkDatabaseConnection } from '../utils/supabase.js'
import { checkTablesExist } from '../database/migrationRunner.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const startTime = Date.now()

    // Check database connection
    const dbConnection = await checkDatabaseConnection()

    // Check if core tables exist
    const tablesStatus = await checkTablesExist()

    const responseTime = Date.now() - startTime

    const healthStatus = {
      status: dbConnection ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: {
          status: dbConnection ? 'connected' : 'disconnected',
          tables: tablesStatus,
        },
        api: {
          status: 'running',
          version: '1.0.0',
        },
      },
      environment: process.env.NODE_ENV || 'development',
    }

    const statusCode = dbConnection ? 200 : 503
    res.status(statusCode).json(healthStatus)
  } catch (error) {
    console.error('Health check failed:', error)
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        database: { status: 'error' },
        api: { status: 'running' },
      },
    })
  }
})

export { router as healthRouter }
