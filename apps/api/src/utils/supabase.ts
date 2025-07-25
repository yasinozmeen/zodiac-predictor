import { createClient } from '@supabase/supabase-js'
import { config } from './config'

// Create mock client for test environment
function createMockSupabaseClient() {
  const mockData = {
    id: 'mock-uuid-1234',
    session_id: 'test-session-123',
    ip_address: '127.0.0.1',
    user_agent: 'Test User Agent',
    progress_data: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const mockEmpty = { data: [], error: null }

  const createChainableMock = (data: any = mockData) => ({
    ...{ data: Array.isArray(data) ? data : [data], error: null },
    single: () => ({ data, error: null }),
    eq: () => createChainableMock(data),
    limit: () => createChainableMock(data),
    order: () => createChainableMock(data),
    range: () => createChainableMock(data),
    gte: () => createChainableMock(data),
    lt: () => createChainableMock(data),
    ilike: () => createChainableMock(data),
    select: () => createChainableMock(data),
  })

  return {
    from: (_table: string) => ({
      select: (_columns?: string) => createChainableMock(mockData),
      insert: (_data: any) => ({
        ...createChainableMock(mockData),
        select: () => createChainableMock(mockData),
      }),
      update: (_data: any) => ({
        ...createChainableMock(mockData),
        eq: () => createChainableMock(mockData),
        select: () => createChainableMock(mockData),
      }),
      delete: () => ({
        ...createChainableMock([]),
        eq: () => createChainableMock([]),
        lt: () => createChainableMock([]),
        ilike: () => createChainableMock([]),
        select: () => createChainableMock([]),
      }),
    }),
    rpc: () => mockEmpty,
  }
}

// Create and export supabase client
let supabaseClient: any

// Use mock client only when explicitly requested
if (process.env.MOCK_SUPABASE === 'true') {
  supabaseClient = createMockSupabaseClient()
} else {
  if (!config.supabase.url || !config.supabase.serviceRoleKey) {
    throw new Error('Supabase URL and Service Role Key are required')
  }

  // Create Supabase client for backend operations
  supabaseClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export const supabase = supabaseClient

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabaseClient.from('categories').select('count').single()
    return !error
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}
