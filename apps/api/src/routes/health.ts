import { Router, Request, Response } from 'express'
import { checkDatabaseConnection } from '../utils/supabase.js'
import { checkTablesExist } from '../database/migrationRunner.js'
import { config } from '../utils/config.js'

const router = Router()

// Health check response interface
interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  responseTime: string
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'error'
      tables?: Record<string, boolean>
      latency?: number
    }
    api: {
      status: 'running'
      version: string
      uptime: number
    }
  }
  environment: string
  memory?: {
    used: number
    total: number
    percentage: number
  }
}

// Memory usage helper
function getMemoryUsage() {
  const memUsage = process.memoryUsage()
  const totalMem = memUsage.heapTotal
  const usedMem = memUsage.heapUsed

  return {
    used: Math.round(usedMem / 1024 / 1024), // MB
    total: Math.round(totalMem / 1024 / 1024), // MB
    percentage: Math.round((usedMem / totalMem) * 100),
  }
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now()
    const dbCheckStart = Date.now()

    // Check database connection with latency measurement
    const dbConnection = await checkDatabaseConnection()
    const dbLatency = Date.now() - dbCheckStart

    // Check if core tables exist
    const tablesStatus = await checkTablesExist()

    const responseTime = Date.now() - startTime
    const memoryUsage = getMemoryUsage()

    // Determine overall health status
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'

    if (!dbConnection) {
      overallStatus = 'unhealthy'
    } else if (dbLatency > 1000 || memoryUsage.percentage > 90) {
      overallStatus = 'degraded'
    }

    const healthStatus: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: {
          status: dbConnection ? 'connected' : 'disconnected',
          tables: tablesStatus,
          latency: dbLatency,
        },
        api: {
          status: 'running',
          version: '1.0.0',
          uptime: Math.floor(process.uptime()),
        },
      },
      environment: config.nodeEnv,
      memory: memoryUsage,
    }

    // Set appropriate status code
    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503

    res.status(statusCode).json(healthStatus)
  } catch (error) {
    console.error('Health check failed:', error)
    const errorResponse: Partial<HealthCheckResponse> = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: { status: 'error' },
        api: {
          status: 'running',
          version: '1.0.0',
          uptime: Math.floor(process.uptime()),
        },
      },
      environment: config.nodeEnv,
    }

    res.status(503).json({
      ...errorResponse,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export { router as healthRouter }
