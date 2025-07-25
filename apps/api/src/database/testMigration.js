import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL and Service Role Key are required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')

  try {
    // Test basic connection
    const { error } = await supabase.from('_test_connection').select('*').limit(1)

    if (error && !error.message.includes('relation "_test_connection" does not exist')) {
      throw error
    }

    console.log('✅ Supabase connection successful!')
    console.log(`📍 Connected to: ${supabaseUrl}`)

    // Check if our tables exist
    const tablesCheck = await Promise.all([
      supabase.from('categories').select('count').limit(1),
      supabase.from('questions').select('count').limit(1),
      supabase.from('question_options').select('count').limit(1),
    ])

    const [categoriesResult, questionsResult, optionsResult] = tablesCheck

    console.log('\n📊 Table Status:')
    console.log(`   categories: ${!categoriesResult.error ? '✅ exists' : '❌ missing'}`)
    console.log(`   questions: ${!questionsResult.error ? '✅ exists' : '❌ missing'}`)
    console.log(`   question_options: ${!optionsResult.error ? '✅ exists' : '❌ missing'}`)

    // If any table is missing, show migration SQL
    if (categoriesResult.error || questionsResult.error || optionsResult.error) {
      console.log('\n📝 Tables are missing. Run this SQL in Supabase SQL Editor:')
      console.log(
        '   https://supabase.com/dashboard/project/' +
          supabaseUrl.split('//')[1].split('.')[0] +
          '/sql'
      )
      console.log('\n' + '='.repeat(60))

      const migrationPath = path.join(__dirname, 'migrations', '001_create_core_tables.sql')
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
      console.log(migrationSQL)
      console.log('='.repeat(60))
    } else {
      // Test data retrieval
      console.log('\n🧪 Testing data retrieval...')
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name, order_index')
        .order('order_index')

      if (catError) {
        console.error('❌ Error fetching categories:', catError.message)
      } else {
        console.log(`✅ Found ${categories.length} categories:`)
        categories.forEach(cat => console.log(`   - ${cat.name} (order: ${cat.order_index})`))
      }
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()
