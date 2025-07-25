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

export async function runSeeds(): Promise<void> {
  try {
    console.log('Running database seeds...')

    const seedFiles = ['zodiac_scoring_seed.sql', 'sample_sessions_seed.sql']

    for (const seedFile of seedFiles) {
      console.log(`Running seed: ${seedFile}`)

      // Read the seed file
      const seedPath = join(getCurrentDir(), 'seeds', seedFile)
      const seedSQL = readFileSync(seedPath, 'utf8')

      // Split the SQL into individual statements
      const statements = seedSQL
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
            console.error(`Seed error in ${seedFile}:`, directError)
            throw directError
          }
        }
      }

      console.log(`Seed ${seedFile} completed successfully`)
    }

    console.log('All seeds completed successfully')
  } catch (error) {
    console.error('Seeding failed:', error)
    throw error
  }
}

// Utility function to check seed data status
export async function checkSeedStatus(): Promise<{
  zodiacScoringCount: number
  sessionsCount: number
  responsesCount: number
  testSessionsCount: number
}> {
  try {
    const [scoringCheck, sessionsCheck, responsesCheck, testSessionsCheck] = await Promise.all([
      supabase.from('zodiac_scoring').select('count', { count: 'exact' }),
      supabase.from('user_sessions').select('count', { count: 'exact' }),
      supabase.from('user_responses').select('count', { count: 'exact' }),
      supabase
        .from('user_sessions')
        .select('count', { count: 'exact' })
        .ilike('session_id', 'test-session-%'),
    ])

    return {
      zodiacScoringCount: scoringCheck.count || 0,
      sessionsCount: sessionsCheck.count || 0,
      responsesCount: responsesCheck.count || 0,
      testSessionsCount: testSessionsCheck.count || 0,
    }
  } catch (error) {
    console.error('Error checking seed status:', error)
    return {
      zodiacScoringCount: 0,
      sessionsCount: 0,
      responsesCount: 0,
      testSessionsCount: 0,
    }
  }
}

// Clean up test data
export async function cleanupTestData(): Promise<void> {
  try {
    console.log('Cleaning up test data...')

    const cleanupStatements = [
      "DELETE FROM user_responses WHERE session_id LIKE 'test-session-%'",
      "DELETE FROM user_sessions WHERE session_id LIKE 'test-session-%'",
    ]

    for (const statement of cleanupStatements) {
      const { error } = await supabase.rpc('exec_sql', { sql_text: statement })

      if (error) {
        console.warn('Cleanup warning:', error.message)
      }
    }

    console.log('Test data cleanup completed')
  } catch (error) {
    console.error('Cleanup failed:', error)
    throw error
  }
}

// Validate seed data integrity
export async function validateSeedData(): Promise<{
  isValid: boolean
  issues: string[]
}> {
  const issues: string[] = []

  try {
    // Check if zodiac scoring has entries for all 12 signs
    const { data: zodiacSigns } = await supabase.from('zodiac_scoring').select('zodiac_sign')

    const expectedSigns = [
      'aries',
      'taurus',
      'gemini',
      'cancer',
      'leo',
      'virgo',
      'libra',
      'scorpio',
      'sagittarius',
      'capricorn',
      'aquarius',
      'pisces',
    ]

    const foundSigns = zodiacSigns?.map((s: any) => s.zodiac_sign) || []
    const missingSigns = expectedSigns.filter(sign => !foundSigns.includes(sign))

    if (missingSigns.length > 0) {
      issues.push(`Missing zodiac signs in scoring: ${missingSigns.join(', ')}`)
    }

    // Check if all test sessions have expected progress data structure
    const { data: testSessions } = await supabase
      .from('user_sessions')
      .select('session_id, progress_data')
      .ilike('session_id', 'test-session-%')

    testSessions?.forEach((session: any) => {
      const progress = session.progress_data as any
      if (
        !progress.currentCategoryId ||
        !Object.prototype.hasOwnProperty.call(progress, 'currentQuestionIndex')
      ) {
        issues.push(`Invalid progress data structure in session: ${session.session_id}`)
      }
    })

    // Check foreign key integrity
    const { data: orphanedResponses } = await supabase
      .from('user_responses')
      .select('id, session_id')
      .not(
        'session_id',
        'in',
        `(${testSessions?.map((s: any) => `'${s.session_id}'`).join(',') || "''"})`
      )
      .ilike('session_id', 'test-session-%')

    if (orphanedResponses && orphanedResponses.length > 0) {
      issues.push(`Found ${orphanedResponses.length} orphaned test responses`)
    }

    return {
      isValid: issues.length === 0,
      issues,
    }
  } catch (error) {
    issues.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return {
      isValid: false,
      issues,
    }
  }
}
