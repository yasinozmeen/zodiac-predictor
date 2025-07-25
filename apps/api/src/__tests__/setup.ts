// Load environment variables from .env file for tests
import dotenv from 'dotenv'
dotenv.config()

// Test environment configuration with real database
process.env.NODE_ENV = 'test'

// Use real Supabase for integration tests since tables are now available
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('🧪 Running integration tests with real Supabase database')
} else {
  process.env.MOCK_SUPABASE = 'true'
  console.log('🧪 Running tests in mock mode - database credentials not found')
}

process.env.NODE_ENV = 'test'

// Add timeout configuration for database operations
jest.setTimeout(30000)

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
