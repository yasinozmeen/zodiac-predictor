import { supabase } from '../utils/supabase.js'
import type { Question, QuestionOption } from '@zodiac/shared'
import type {
  CreateQuestionData,
  UpdateQuestionData,
  QuestionWithOptions,
} from '../models/Question.js'

export class QuestionService {
  static async getAll(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`)
    }

    return data.map(this.mapDatabaseToModel)
  }

  static async getByCategory(categoryId: string): Promise<QuestionWithOptions[]> {
    const { data, error } = await supabase
      .from('questions')
      .select(
        `
        *,
        question_options (
          id,
          question_id,
          option_text,
          order_index
        )
      `
      )
      .eq('category_id', categoryId)
      .order('order_index', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch questions by category: ${error.message}`)
    }

    return data.map((row: any) => ({
      ...this.mapDatabaseToModel(row),
      options: row.question_options?.map(this.mapOptionDatabaseToModel) || [],
    }))
  }

  static async getById(id: string): Promise<Question | null> {
    const { data, error } = await supabase.from('questions').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw new Error(`Failed to fetch question: ${error.message}`)
    }

    return this.mapDatabaseToModel(data)
  }

  static async getWithOptions(id: string): Promise<QuestionWithOptions | null> {
    const { data, error } = await supabase
      .from('questions')
      .select(
        `
        *,
        question_options (
          id,
          question_id,
          option_text,
          order_index
        )
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw new Error(`Failed to fetch question with options: ${error.message}`)
    }

    return {
      ...this.mapDatabaseToModel(data),
      options: data.question_options?.map(this.mapOptionDatabaseToModel) || [],
    }
  }

  static async create(questionData: CreateQuestionData): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .insert({
        category_id: questionData.categoryId,
        question_text: questionData.questionText,
        order_index: questionData.orderIndex,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create question: ${error.message}`)
    }

    return this.mapDatabaseToModel(data)
  }

  static async update(id: string, updateData: UpdateQuestionData): Promise<Question> {
    const updatePayload: any = {}

    if (updateData.categoryId !== undefined) updatePayload.category_id = updateData.categoryId
    if (updateData.questionText !== undefined) updatePayload.question_text = updateData.questionText
    if (updateData.orderIndex !== undefined) updatePayload.order_index = updateData.orderIndex

    const { data, error } = await supabase
      .from('questions')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update question: ${error.message}`)
    }

    return this.mapDatabaseToModel(data)
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('questions').delete().eq('id', id)

    if (error) {
      throw new Error(`Failed to delete question: ${error.message}`)
    }
  }

  // Map database row to model interface
  private static mapDatabaseToModel(row: any): Question {
    return {
      id: row.id,
      categoryId: row.category_id,
      questionText: row.question_text,
      orderIndex: row.order_index,
      createdAt: row.created_at,
    }
  }

  // Map option database row to model interface
  private static mapOptionDatabaseToModel(row: any): QuestionOption {
    return {
      id: row.id,
      questionId: row.question_id,
      optionText: row.option_text,
      orderIndex: row.order_index,
    }
  }
}
