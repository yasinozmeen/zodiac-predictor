import { Request, Response } from 'express'
import { SessionService } from '../services/sessionService.js'
import { UserResponseService } from '../services/userResponseService.js'
import type { CreateUserSessionData } from '../models/UserSession.js'

export class SessionController {
  // Create new session
  static async createSession(req: Request, res: Response): Promise<void> {
    try {
      const { ipAddress, userAgent } = req.body as {
        ipAddress?: string
        userAgent?: string
      }

      // Generate unique session ID
      const sessionId = SessionService.generateSessionId()

      const sessionData: CreateUserSessionData = {
        sessionId,
        ipAddress: ipAddress || req.ip,
        userAgent: userAgent || req.get('User-Agent'),
        progressData: {
          currentCategoryId: null,
          currentQuestionIndex: 0,
          totalQuestions: 16,
          completedQuestions: [],
          startedAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
        },
      }

      const session = await SessionService.create(sessionData)

      res.status(201).json({
        success: true,
        data: session,
        message: 'Session created successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error creating session:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create session',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Get session by ID
  static async getSession(req: Request, res: Response): Promise<void> {
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

      const session = await SessionService.getBySessionId(sessionId)

      if (!session) {
        res.status(404).json({
          success: false,
          message: 'Session not found',
          timestamp: new Date().toISOString(),
        })
        return
      }

      res.json({
        success: true,
        data: session,
        message: 'Session retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error fetching session:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch session',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Get session with responses
  static async getSessionWithResponses(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params

      const session = await SessionService.getWithResponses(sessionId)

      if (!session) {
        res.status(404).json({
          success: false,
          message: 'Session not found',
          timestamp: new Date().toISOString(),
        })
        return
      }

      res.json({
        success: true,
        data: session,
        message: 'Session with responses retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error fetching session with responses:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch session with responses',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Update session progress
  static async updateSessionProgress(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params
      const progressData = req.body

      const session = await SessionService.updateProgress(sessionId, progressData)

      res.json({
        success: true,
        data: session,
        message: 'Session progress updated successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error updating session progress:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update session progress',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Get session statistics
  static async getSessionStats(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params

      const stats = await SessionService.getSessionStats(sessionId)

      res.json({
        success: true,
        data: stats,
        message: 'Session statistics retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error fetching session stats:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch session statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Validate session
  static async validateSession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params

      const validation = await SessionService.validateSession(sessionId)

      res.json({
        success: true,
        data: validation,
        message: 'Session validation completed',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error validating session:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to validate session',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Get session completion progress
  static async getSessionProgress(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params

      const progress = await UserResponseService.getCompletionProgress(sessionId)

      res.json({
        success: true,
        data: progress,
        message: 'Session progress retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error fetching session progress:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch session progress',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Get all sessions (admin/debug endpoint)
  static async getAllSessions(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100) // Max 100 per page

      const result = await SessionService.getAll(page, limit)

      res.json({
        success: true,
        data: result,
        message: 'Sessions retrieved successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error fetching all sessions:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sessions',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Delete session
  static async deleteSession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params

      await SessionService.delete(sessionId)

      res.json({
        success: true,
        message: 'Session deleted successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error deleting session:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete session',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Cleanup expired sessions (admin endpoint)
  static async cleanupExpiredSessions(req: Request, res: Response): Promise<void> {
    try {
      const deletedCount = await SessionService.cleanupExpiredSessions()

      res.json({
        success: true,
        data: { deletedCount },
        message: `Cleaned up ${deletedCount} expired sessions`,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error('Error cleaning up expired sessions:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup expired sessions',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      })
    }
  }
}
