import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function testTables() {
  console.log('🔍 Testing database tables...')

  try {
    // Test categories table
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('order_index')

    if (catError) {
      console.error('❌ Categories table error:', catError.message)
      return false
    }

    console.log(`✅ Categories table: ${categories.length} records found`)
    categories.forEach(cat => console.log(`   - ${cat.name}`))

    // Test questions table
    const { data: questions, error: qError } = await supabase.from('questions').select('*').limit(1)

    if (qError) {
      console.error('❌ Questions table error:', qError.message)
      return false
    }

    console.log(`✅ Questions table: accessible (${questions.length} records)`)

    // Test question_options table
    const { data: options, error: oError } = await supabase
      .from('question_options')
      .select('*')
      .limit(1)

    if (oError) {
      console.error('❌ Question_options table error:', oError.message)
      return false
    }

    console.log(`✅ Question_options table: accessible (${options.length} records)`)

    console.log('\n🎉 All tables are working correctly!')
    return true
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

testTables()
