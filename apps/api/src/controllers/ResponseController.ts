import { Request, Response } from 'express'
import { UserResponseService } from '../services/userResponseService.js'
import { ZodiacScoringService } from '../services/zodiacScoringService.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { RESPONSE_MESSAGES, HTTP_STATUS } from '../config/constants.js'
import type { CreateUserResponseData, BulkResponseData } from '../models/UserResponse.js'

export class ResponseController {
  // Create new response
  static async createResponse(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, questionId, selectedOptionId } = req.body as CreateUserResponseData

      // Validate required fields
      if (!sessionId || !questionId || !selectedOptionId) {
        ApiResponse.validationError(
          res,
          'Session ID, question ID, and selected option ID are required'
        )
        return
      }

      // Validate the response data
      const validation = await UserResponseService.validateResponse({
        sessionId,
        questionId,
        selectedOptionId,
      })

      if (!validation.isValid) {
        ApiResponse.validationError(res, RESPONSE_MESSAGES.RESPONSE_VALIDATION_FAILED, validation)
        return
      }

      // Create or update the response
      const response = await UserResponseService.upsert({
        sessionId,
        questionId,
        selectedOptionId,
      })

      ApiResponse.created(
        res,
        response,
        validation.alreadyAnswered
          ? RESPONSE_MESSAGES.RESPONSE_UPDATED
          : RESPONSE_MESSAGES.RESPONSE_CREATED
      )
      return
    } catch (error: any) {
      console.error('Error creating response:', error)
      ApiResponse.error(res, 'Failed to create response', HTTP_STATUS.INTERNAL_SERVER_ERROR, error)
      return
    }
  }

  // Get all responses for a session
  static async getSessionResponses(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params
      const includeDetails = req.query.includeDetails === 'true'

      if (!sessionId) {
        res.status(400).json({
          success: false,
          message: 'Session ID is required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      let responses
      if (includeDetails) {
        responses = await UserResponseService.getWithDetails(sessionId)
      } else {
        responses = await UserResponseService.getBySessionId(sessionId)
      }

      res.json({
        success: true,
        data: responses,
        message: 'Session responses retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error fetching session responses:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch session responses',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Get specific response by session and question
  static async getResponse(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, questionId } = req.params

      if (!sessionId || !questionId) {
        res.status(400).json({
          success: false,
          message: 'Session ID and question ID are required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      const response = await UserResponseService.getBySessionAndQuestion(sessionId, questionId)

      if (!response) {
        res.status(404).json({
          success: false,
          message: 'Response not found',
          timestamp: new Date().toISOString(),
        })
        return
      }

      res.json({
        success: true,
        data: response,
        message: 'Response retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error fetching response:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch response',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Update response
  static async updateResponse(req: Request, res: Response): Promise<void> {
    try {
      const { responseId } = req.params
      const { selectedOptionId } = req.body

      if (!responseId) {
        res.status(400).json({
          success: false,
          message: 'Response ID is required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      if (!selectedOptionId) {
        res.status(400).json({
          success: false,
          message: 'Selected option ID is required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      const response = await UserResponseService.update(responseId, {
        selectedOptionId,
        answeredAt: new Date().toISOString(),
      })

      res.json({
        success: true,
        data: response,
        message: 'Response updated successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error updating response:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update response',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Bulk create responses
  static async bulkCreateResponses(req: Request, res: Response): Promise<void> {
    try {
      const bulkData = req.body as BulkResponseData

      if (!bulkData.sessionId || !bulkData.responses || !Array.isArray(bulkData.responses)) {
        res.status(400).json({
          success: false,
          message: 'Session ID and responses array are required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      if (bulkData.responses.length === 0) {
        res.status(400).json({
          success: false,
          message: 'At least one response is required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      const result = await UserResponseService.bulkCreate(bulkData)

      const statusCode = result.failed.length > 0 ? 207 : 201 // 207 Multi-Status if some failed

      res.status(statusCode).json({
        success: result.failed.length === 0,
        data: result,
        message: `Processed ${result.totalProcessed} responses. ${result.successful.length} successful, ${result.failed.length} failed.`,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error bulk creating responses:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to bulk create responses',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Get response statistics for a session
  static async getResponseStats(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params

      if (!sessionId) {
        res.status(400).json({
          success: false,
          message: 'Session ID is required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      const stats = await UserResponseService.getSessionResponseStats(sessionId)

      res.json({
        success: true,
        data: stats,
        message: 'Response statistics retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error fetching response stats:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch response statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Calculate zodiac scores for a session
  static async calculateZodiacScores(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params

      if (!sessionId) {
        res.status(400).json({
          success: false,
          message: 'Session ID is required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      const calculation = await ZodiacScoringService.calculateZodiacScores(sessionId)

      res.json({
        success: true,
        data: calculation,
        message: 'Zodiac scores calculated successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error calculating zodiac scores:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to calculate zodiac scores',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Validate response data
  static async validateResponseData(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, questionId, selectedOptionId } = req.body as CreateUserResponseData

      if (!sessionId || !questionId || !selectedOptionId) {
        res.status(400).json({
          success: false,
          message: 'Session ID, question ID, and selected option ID are required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      const validation = await UserResponseService.validateResponse({
        sessionId,
        questionId,
        selectedOptionId,
      })

      res.json({
        success: true,
        data: validation,
        message: 'Response validation completed',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error validating response:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to validate response',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Delete response
  static async deleteResponse(req: Request, res: Response): Promise<void> {
    try {
      const { responseId } = req.params

      if (!responseId) {
        res.status(400).json({
          success: false,
          message: 'Response ID is required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      await UserResponseService.delete(responseId)

      res.json({
        success: true,
        message: 'Response deleted successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error deleting response:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete response',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Delete all responses for a session
  static async deleteSessionResponses(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params

      if (!sessionId) {
        res.status(400).json({
          success: false,
          message: 'Session ID is required',
          timestamp: new Date().toISOString(),
        })
        return
      }

      const deletedCount = await UserResponseService.deleteBySessionId(sessionId)

      res.json({
        success: true,
        data: { deletedCount },
        message: `Deleted ${deletedCount} responses for session`,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error deleting session responses:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete session responses',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }
}
