import type { Category } from '@zodiac/shared'

export interface CategoryModel extends Category {
  // Additional backend-specific properties if needed
}

export interface CreateCategoryData {
  name: string
  description?: string
  orderIndex: number
  iconName?: string
}

export interface UpdateCategoryData {
  name?: string
  description?: string
  orderIndex?: number
  iconName?: string
}
