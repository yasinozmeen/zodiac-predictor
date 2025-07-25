import { Request, Response } from 'express'
import { QuestionService } from '../services/questionService.js'
import { QuestionOptionService } from '../services/questionOptionService.js'

export class QuestionController {
  static async getQuestions(req: Request, res: Response): Promise<void> {
    try {
      const questions = await QuestionService.getAll()

      res.json({
        success: true,
        data: questions,
        message: 'Questions retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error fetching questions:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch questions',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  static async getQuestionsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params
      const questions = await QuestionService.getByCategory(categoryId)

      res.json({
        success: true,
        data: questions,
        message: 'Questions retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error fetching questions by category:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch questions by category',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  static async getQuestionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const question = await QuestionService.getWithOptions(id)

      if (!question) {
        res.status(404).json({
          success: false,
          message: 'Question not found',
          timestamp: new Date().toISOString(),
        })
        return
      }

      res.json({
        success: true,
        data: question,
        message: 'Question retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error fetching question:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch question',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  static async getQuestionOptions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const options = await QuestionOptionService.getByQuestionId(id)

      res.json({
        success: true,
        data: options,
        message: 'Question options retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error fetching question options:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch question options',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  static async createQuestion(req: Request, res: Response): Promise<void> {
    try {
      const questionData = req.body
      const question = await QuestionService.create(questionData)

      res.status(201).json({
        success: true,
        data: question,
        message: 'Question created successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error creating question:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create question',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  static async updateQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updateData = req.body
      const question = await QuestionService.update(id, updateData)

      res.json({
        success: true,
        data: question,
        message: 'Question updated successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error updating question:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update question',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  static async deleteQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      await QuestionService.delete(id)

      res.json({
        success: true,
        message: 'Question deleted successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error deleting question:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete question',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }
}
