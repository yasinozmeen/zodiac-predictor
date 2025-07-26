import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { supabase } from '../../utils/supabase.js'

// Get current file path for ES modules
const getCurrentDir = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      const currentFile = fileURLToPath(import.meta.url)
      return dirname(currentFile)
    }
  } catch {
    // Fall through to CommonJS fallback
  }
  // Fallback for test environment (CommonJS)
  return __dirname
}

interface SeedResult {
  table: string
  inserted: number
  skipped: number
  errors: string[]
}

/**
 * Load and insert JSON seed data into database tables
 * Order-dependent seeding: Categories → Questions → QuestionOptions → ZodiacScoring
 */
export async function runJsonSeeds(): Promise<{
  success: boolean
  results: SeedResult[]
  summary: string
}> {
  const results: SeedResult[] = []
  let allSuccess = true

  try {
    console.log('🌱 Starting JSON-based database seeding...')

    // Define seeding order (important for foreign key dependencies)
    const seedConfigs = [
      {
        table: 'categories',
        file: 'categories_seed.json',
        description: 'Question categories',
      },
      {
        table: 'questions',
        file: 'questions_seed.json',
        description: 'Survey questions',
      },
      {
        table: 'question_options',
        file: 'question_options_seed.json',
        description: 'Question answer options',
      },
    ]

    for (const config of seedConfigs) {
      console.log(`\n📋 Seeding ${config.description} (${config.table})...`)

      const result = await seedTable(config.table, config.file)
      results.push(result)

      if (result.errors.length > 0) {
        allSuccess = false
        console.error(`❌ Errors in ${config.table}:`, result.errors)
      } else {
        console.log(`✅ ${config.table}: ${result.inserted} inserted, ${result.skipped} skipped`)
      }
    }

    // Generate summary
    const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0)
    const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0)
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)

    const summary = `Seeding completed: ${totalInserted} inserted, ${totalSkipped} skipped, ${totalErrors} errors`

    if (allSuccess) {
      console.log(`\n🎉 ${summary}`)
    } else {
      console.log(`\n⚠️ ${summary}`)
    }

    return {
      success: allSuccess,
      results,
      summary,
    }
  } catch (error) {
    const errorMessage = `JSON seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    console.error('💥', errorMessage)

    return {
      success: false,
      results,
      summary: errorMessage,
    }
  }
}

/**
 * Seed a single table with JSON data
 */
async function seedTable(tableName: string, fileName: string): Promise<SeedResult> {
  const result: SeedResult = {
    table: tableName,
    inserted: 0,
    skipped: 0,
    errors: [],
  }

  try {
    // Read JSON seed file
    const seedPath = join(getCurrentDir(), fileName)
    const seedData = JSON.parse(readFileSync(seedPath, 'utf8'))

    if (!Array.isArray(seedData)) {
      result.errors.push('Seed data must be an array')
      return result
    }

    // Process each record
    for (const record of seedData) {
      try {
        // Check if record already exists (using 'id' field)
        if (record.id) {
          const { data: existing } = await supabase
            .from(tableName)
            .select('id')
            .eq('id', record.id)
            .single()

          if (existing) {
            result.skipped++
            continue
          }
        }

        // Insert new record
        const { error } = await supabase.from(tableName).insert(record)

        if (error) {
          result.errors.push(`Record ${record.id || 'unknown'}: ${error.message}`)
        } else {
          result.inserted++
        }
      } catch (recordError) {
        result.errors.push(
          `Record ${record.id || 'unknown'}: ${
            recordError instanceof Error ? recordError.message : 'Unknown error'
          }`
        )
      }
    }
  } catch (error) {
    result.errors.push(
      `Table ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }

  return result
}

/**
 * Clean up all seeded data (for testing/development)
 */
export async function cleanupJsonSeeds(): Promise<void> {
  console.log('🧹 Cleaning up JSON seed data...')

  const tables = ['question_options', 'questions', 'categories'] // Reverse order for FK constraints

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).delete().neq('id', 'never-matches')

      if (error) {
        console.warn(`Warning cleaning ${table}:`, error.message)
      } else {
        console.log(`✅ Cleaned ${table}`)
      }
    } catch (error) {
      console.warn(`Warning cleaning ${table}:`, error)
    }
  }

  console.log('🎯 JSON seed cleanup completed')
}

/**
 * Validate JSON seed data integrity
 */
export async function validateJsonSeeds(): Promise<{
  isValid: boolean
  issues: string[]
  stats: Record<string, number>
}> {
  const issues: string[] = []
  const stats: Record<string, number> = {}

  try {
    console.log('🔍 Validating JSON seed data...')

    // Check categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, order_index')
      .order('order_index')

    if (catError) {
      issues.push(`Categories query error: ${catError.message}`)
    } else {
      stats.categories = categories?.length || 0

      // Validate minimum categories (expecting at least 5)
      if ((categories?.length || 0) < 5) {
        issues.push(`Missing categories: expected at least 5, found ${categories?.length || 0}`)
      }
    }

    // Check questions
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, category_id, question_text')

    if (qError) {
      issues.push(`Questions query error: ${qError.message}`)
    } else {
      stats.questions = questions?.length || 0

      // Check foreign key integrity
      const questionCategories = [...new Set(questions?.map((q: any) => q.category_id) || [])]
      const categoryIds = categories?.map((c: any) => c.id) || []
      const invalidCategories = questionCategories.filter(id => !categoryIds.includes(id))

      if (invalidCategories.length > 0) {
        issues.push(`Questions reference invalid categories: ${invalidCategories.join(', ')}`)
      }
    }

    // Check question options
    const { data: options, error: optError } = await supabase
      .from('question_options')
      .select('id, question_id, option_text')

    if (optError) {
      issues.push(`Question options query error: ${optError.message}`)
    } else {
      stats.questionOptions = options?.length || 0

      // Check foreign key integrity
      const optionQuestions = [...new Set(options?.map((o: any) => o.question_id) || [])]
      const questionIds = questions?.map((q: any) => q.id) || []
      const invalidQuestions = optionQuestions.filter(id => !questionIds.includes(id))

      if (invalidQuestions.length > 0) {
        issues.push(`Options reference invalid questions: ${invalidQuestions.join(', ')}`)
      }
    }

    console.log('📊 Validation stats:', stats)

    return {
      isValid: issues.length === 0,
      issues,
      stats,
    }
  } catch (error) {
    issues.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`)

    return {
      isValid: false,
      issues,
      stats,
    }
  }
}

/**
 * Get comprehensive seed status
 */
export async function getJsonSeedStatus(): Promise<{
  seeded: boolean
  counts: Record<string, number>
  lastUpdated: string | null
}> {
  try {
    const [categoriesResult, questionsResult, optionsResult] = await Promise.all([
      supabase.from('categories').select('count', { count: 'exact' }),
      supabase.from('questions').select('count', { count: 'exact' }),
      supabase.from('question_options').select('count', { count: 'exact' }),
    ])

    const counts = {
      categories: categoriesResult.count || 0,
      questions: questionsResult.count || 0,
      questionOptions: optionsResult.count || 0,
    }

    // Get most recent update timestamp
    const { data: recentUpdate } = await supabase
      .from('categories')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    return {
      seeded: counts.categories > 0 && counts.questions > 0,
      counts,
      lastUpdated: recentUpdate?.updated_at || null,
    }
  } catch (error) {
    console.error('Error getting seed status:', error)
    return {
      seeded: false,
      counts: { categories: 0, questions: 0, questionOptions: 0 },
      lastUpdated: null,
    }
  }
}
