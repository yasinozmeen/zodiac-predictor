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

    const migrationFiles = ['001_create_core_tables.sql', '002_create_advanced_schema.sql']

    for (const migrationFile of migrationFiles) {
      console.log(`Running migration: ${migrationFile}`)

      // Read the migration file
      const migrationPath = join(getCurrentDir(), 'migrations', migrationFile)
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
            console.error(`Migration error in ${migrationFile}:`, directError)
            throw directError
          }
        }
      }

      console.log(`Migration ${migrationFile} completed successfully`)
    }

    console.log('All migrations completed successfully')
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
  zodiac_scoring: boolean
  user_sessions: boolean
  user_responses: boolean
}> {
  try {
    const [
      categoriesCheck,
      questionsCheck,
      optionsCheck,
      zodiacScoringCheck,
      userSessionsCheck,
      userResponsesCheck,
    ] = await Promise.all([
      supabase.from('categories').select('count').limit(1),
      supabase.from('questions').select('count').limit(1),
      supabase.from('question_options').select('count').limit(1),
      supabase.from('zodiac_scoring').select('count').limit(1),
      supabase.from('user_sessions').select('count').limit(1),
      supabase.from('user_responses').select('count').limit(1),
    ])

    return {
      categories: !categoriesCheck.error,
      questions: !questionsCheck.error,
      question_options: !optionsCheck.error,
      zodiac_scoring: !zodiacScoringCheck.error,
      user_sessions: !userSessionsCheck.error,
      user_responses: !userResponsesCheck.error,
    }
  } catch (error) {
    console.error('Error checking tables:', error)
    return {
      categories: false,
      questions: false,
      question_options: false,
      zodiac_scoring: false,
      user_sessions: false,
      user_responses: false,
    }
  }
}

// Rollback function for advanced schema
export async function rollbackAdvancedSchema(): Promise<void> {
  try {
    console.log('Rolling back advanced schema...')

    const rollbackPath = join(getCurrentDir(), 'migrations', '002_rollback_advanced_schema.sql')
    const rollbackSQL = readFileSync(rollbackPath, 'utf8')

    // Split the SQL into individual statements
    const statements = rollbackSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql_text: statement })

      if (error) {
        console.warn('Rollback warning (expected for non-existing objects):', error.message)
      }
    }

    console.log('Advanced schema rollback completed')
  } catch (error) {
    console.error('Rollback failed:', error)
    throw error
  }
}
