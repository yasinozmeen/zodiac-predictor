import { supabase } from '../utils/supabase.js'
import type { Category } from '@zodiac/shared'
import type { CreateCategoryData, UpdateCategoryData } from '../models/Category.js'

export class CategoryService {
  static async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    return data.map(this.mapDatabaseToModel)
  }

  static async getById(id: string): Promise<Category | null> {
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw new Error(`Failed to fetch category: ${error.message}`)
    }

    return this.mapDatabaseToModel(data)
  }

  static async create(categoryData: CreateCategoryData): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: categoryData.name,
        description: categoryData.description || null,
        order_index: categoryData.orderIndex,
        icon_name: categoryData.iconName || null,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`)
    }

    return this.mapDatabaseToModel(data)
  }

  static async update(id: string, updateData: UpdateCategoryData): Promise<Category> {
    const updatePayload: any = {}

    if (updateData.name !== undefined) updatePayload.name = updateData.name
    if (updateData.description !== undefined) updatePayload.description = updateData.description
    if (updateData.orderIndex !== undefined) updatePayload.order_index = updateData.orderIndex
    if (updateData.iconName !== undefined) updatePayload.icon_name = updateData.iconName

    const { data, error } = await supabase
      .from('categories')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`)
    }

    return this.mapDatabaseToModel(data)
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`)
    }
  }

  // Map database row to model interface
  private static mapDatabaseToModel(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      orderIndex: row.order_index,
      iconName: row.icon_name,
      createdAt: row.created_at,
    }
  }
}
