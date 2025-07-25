import { Request, Response } from 'express'
import { CategoryService } from '../services/categoryService.js'

export class CategoryController {
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.getAll()

      res.json({
        success: true,
        data: categories,
        message: 'Categories retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error fetching categories:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const category = await CategoryService.getById(id)

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found',
          timestamp: new Date().toISOString(),
        })
        return
      }

      res.json({
        success: true,
        data: category,
        message: 'Category retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error fetching category:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch category',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData = req.body
      const category = await CategoryService.create(categoryData)

      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error creating category:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updateData = req.body
      const category = await CategoryService.update(id, updateData)

      res.json({
        success: true,
        data: category,
        message: 'Category updated successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error updating category:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update category',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      await CategoryService.delete(id)

      res.json({
        success: true,
        message: 'Category deleted successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error deleting category:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }
}
