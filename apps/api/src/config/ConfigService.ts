/**
 * Centralized Configuration Service
 * Implements Singleton pattern for configuration management
 */

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl: boolean
}

export interface SecurityConfig {
  corsOrigin: string
  jwtSecret: string
  sessionSecret: string
  rateLimitWindowMs: number
  rateLimitMaxRequests: number
}

export interface ServerConfig {
  port: number
  nodeEnv: string
  logLevel: string
  frontendUrl: string
}

export interface AppConfig {
  server: ServerConfig
  database: DatabaseConfig
  security: SecurityConfig
}

export class ConfigService {
  private static instance: ConfigService
  private config: AppConfig

  private constructor() {
    this.config = this.loadConfig()
    this.validateConfig()
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService()
    }
    return ConfigService.instance
  }

  private loadConfig(): AppConfig {
    return {
      server: {
        port: parseInt(process.env.PORT || '5000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
        logLevel: process.env.LOG_LEVEL || 'info',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
      database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'zodiac_predictor',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        ssl: process.env.DB_SSL === 'true',
      },
      security: {
        corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret',
        sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret',
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
        rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      },
    }
  }

  private validateConfig(): void {
    const errors: string[] = []

    // Validate server config
    if (
      !this.config.server.port ||
      this.config.server.port < 1 ||
      this.config.server.port > 65535
    ) {
      errors.push('Invalid server port')
    }

    if (!this.config.server.frontendUrl) {
      errors.push('Frontend URL is required')
    }

    // Validate database config
    if (!this.config.database.host) {
      errors.push('Database host is required')
    }

    if (!this.config.database.database) {
      errors.push('Database name is required')
    }

    // Validate security config - warn in development, error in production
    if (this.config.server.nodeEnv === 'production') {
      if (this.config.security.jwtSecret === 'fallback-jwt-secret') {
        errors.push('JWT_SECRET must be set in production')
      }

      if (this.config.security.sessionSecret === 'fallback-session-secret') {
        errors.push('SESSION_SECRET must be set in production')
      }

      if (!this.config.database.ssl) {
        console.warn('⚠️  Database SSL is disabled in production')
      }
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`)
    }
  }

  get<K extends keyof AppConfig>(section: K): AppConfig[K] {
    return this.config[section]
  }

  getAll(): Readonly<AppConfig> {
    return Object.freeze({ ...this.config })
  }

  isDevelopment(): boolean {
    return this.config.server.nodeEnv === 'development'
  }

  isProduction(): boolean {
    return this.config.server.nodeEnv === 'production'
  }

  isTest(): boolean {
    return this.config.server.nodeEnv === 'test'
  }

  // Method to reload configuration (useful for tests)
  reload(): void {
    this.config = this.loadConfig()
    this.validateConfig()
  }
}
