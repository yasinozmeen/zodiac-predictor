import { supabase } from '../utils/supabase.js'
import type { QuestionOption } from '@zodiac/shared'
import type {
  CreateQuestionOptionData,
  UpdateQuestionOptionData,
} from '../models/QuestionOption.js'

export class QuestionOptionService {
  static async getAll(): Promise<QuestionOption[]> {
    const { data, error } = await supabase
      .from('question_options')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch question options: ${error.message}`)
    }

    return data.map(this.mapDatabaseToModel)
  }

  static async getByQuestionId(questionId: string): Promise<QuestionOption[]> {
    const { data, error } = await supabase
      .from('question_options')
      .select('*')
      .eq('question_id', questionId)
      .order('order_index', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch question options: ${error.message}`)
    }

    return data.map(this.mapDatabaseToModel)
  }

  static async getById(id: string): Promise<QuestionOption | null> {
    const { data, error } = await supabase
      .from('question_options')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw new Error(`Failed to fetch question option: ${error.message}`)
    }

    return this.mapDatabaseToModel(data)
  }

  static async create(optionData: CreateQuestionOptionData): Promise<QuestionOption> {
    const { data, error } = await supabase
      .from('question_options')
      .insert({
        question_id: optionData.questionId,
        option_text: optionData.optionText,
        order_index: optionData.orderIndex,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create question option: ${error.message}`)
    }

    return this.mapDatabaseToModel(data)
  }

  static async createMultiple(optionsData: CreateQuestionOptionData[]): Promise<QuestionOption[]> {
    const { data, error } = await supabase
      .from('question_options')
      .insert(
        optionsData.map(option => ({
          question_id: option.questionId,
          option_text: option.optionText,
          order_index: option.orderIndex,
        }))
      )
      .select()

    if (error) {
      throw new Error(`Failed to create question options: ${error.message}`)
    }

    return data.map(this.mapDatabaseToModel)
  }

  static async update(id: string, updateData: UpdateQuestionOptionData): Promise<QuestionOption> {
    const updatePayload: any = {}

    if (updateData.questionId !== undefined) updatePayload.question_id = updateData.questionId
    if (updateData.optionText !== undefined) updatePayload.option_text = updateData.optionText
    if (updateData.orderIndex !== undefined) updatePayload.order_index = updateData.orderIndex

    const { data, error } = await supabase
      .from('question_options')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update question option: ${error.message}`)
    }

    return this.mapDatabaseToModel(data)
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('question_options').delete().eq('id', id)

    if (error) {
      throw new Error(`Failed to delete question option: ${error.message}`)
    }
  }

  static async deleteByQuestionId(questionId: string): Promise<void> {
    const { error } = await supabase.from('question_options').delete().eq('question_id', questionId)

    if (error) {
      throw new Error(`Failed to delete question options: ${error.message}`)
    }
  }

  // Map database row to model interface
  private static mapDatabaseToModel(row: any): QuestionOption {
    return {
      id: row.id,
      questionId: row.question_id,
      optionText: row.option_text,
      orderIndex: row.order_index,
    }
  }
}
