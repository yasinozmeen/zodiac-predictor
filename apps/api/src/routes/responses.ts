import { Router } from 'express'
import { ResponseController } from '../controllers/ResponseController.js'

const router = Router()

// Create new response
router.post('/', ResponseController.createResponse)

// Bulk create responses
router.post('/bulk', ResponseController.bulkCreateResponses)

// Validate response data
router.post('/validate', ResponseController.validateResponseData)

// Get all responses for a session
router.get('/session/:sessionId', ResponseController.getSessionResponses)

// Get response statistics for a session
router.get('/session/:sessionId/stats', ResponseController.getResponseStats)

// Calculate zodiac scores for a session
router.get('/session/:sessionId/zodiac-scores', ResponseController.calculateZodiacScores)

// Get specific response by session and question
router.get('/session/:sessionId/question/:questionId', ResponseController.getResponse)

// Update response by ID
router.patch('/:responseId', ResponseController.updateResponse)

// Delete response by ID
router.delete('/:responseId', ResponseController.deleteResponse)

// Delete all responses for a session
router.delete('/session/:sessionId', ResponseController.deleteSessionResponses)

export { router as responseRoutes }
