import { Router } from 'express'
import { SessionController } from '../controllers/SessionController.js'

const router = Router()

// Create new session
router.post('/', SessionController.createSession)

// Get all sessions (admin/debug endpoint with pagination)
router.get('/', SessionController.getAllSessions)

// Get session by ID
router.get('/:sessionId', SessionController.getSession)

// Get session with all responses
router.get('/:sessionId/details', SessionController.getSessionWithResponses)

// Update session progress
router.patch('/:sessionId/progress', SessionController.updateSessionProgress)

// Get session statistics
router.get('/:sessionId/stats', SessionController.getSessionStats)

// Get session completion progress
router.get('/:sessionId/progress', SessionController.getSessionProgress)

// Validate session
router.get('/:sessionId/validate', SessionController.validateSession)

// Delete session
router.delete('/:sessionId', SessionController.deleteSession)

// Admin endpoint: cleanup expired sessions
router.post('/cleanup/expired', SessionController.cleanupExpiredSessions)

export { router as sessionRoutes }
