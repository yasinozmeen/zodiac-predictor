import { createClient } from '@supabase/supabase-js'
import { config } from './config.js'

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  throw new Error('Supabase URL and Service Role Key are required')
}

// Create Supabase client for backend operations
export const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('categories').select('count').single()
    return !error
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}
