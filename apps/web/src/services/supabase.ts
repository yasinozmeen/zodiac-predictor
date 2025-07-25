import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anonymous Key are required')
}

// Create Supabase client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

// Health check function
export async function checkConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('categories').select('count').single()
    return !error
  } catch (error) {
    console.error('Supabase connection failed:', error)
    return false
  }
}
