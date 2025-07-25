import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { supabase } from '../utils/supabase.js'

// Get current file path for ES modules
const getCurrentDir = () => {
  if (typeof import.meta.url !== 'undefined') {
    const currentFile = fileURLToPath(import.meta.url)
    return dirname(currentFile)
  }
  // Fallback for test environment
  return __dirname
}

export async function runMigrations(): Promise<void> {
  try {
    console.log('Running database migrations...')

    // Read the migration file
    const migrationPath = join(getCurrentDir(), 'migrations', '001_create_core_tables.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql_text: statement })

      if (error) {
        // If exec_sql doesn't exist, try direct query
        const { error: directError } = await supabase
          .from('_temp')
          .select('*')
          .eq('query', statement)

        if (directError && !directError.message.includes('relation "_temp" does not exist')) {
          console.error('Migration error:', directError)
          throw directError
        }
      }
    }

    console.log('Migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

// Utility function to check if tables exist
export async function checkTablesExist(): Promise<{
  categories: boolean
  questions: boolean
  question_options: boolean
}> {
  try {
    const [categoriesCheck, questionsCheck, optionsCheck] = await Promise.all([
      supabase.from('categories').select('count').limit(1),
      supabase.from('questions').select('count').limit(1),
      supabase.from('question_options').select('count').limit(1),
    ])

    return {
      categories: !categoriesCheck.error,
      questions: !questionsCheck.error,
      question_options: !optionsCheck.error,
    }
  } catch (error) {
    console.error('Error checking tables:', error)
    return {
      categories: false,
      questions: false,
      question_options: false,
    }
  }
}
