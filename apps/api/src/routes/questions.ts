import { Router } from 'express'
import { QuestionController } from '../controllers/QuestionController.js'
import { validateUUID, validateQuestionData } from '../middleware/validation.js'

const router = Router()

// GET /api/v1/questions - Get all questions
router.get('/', QuestionController.getQuestions)

// GET /api/v1/questions/category/:categoryId - Get questions by category
router.get(
  '/category/:categoryId',
  validateUUID('categoryId'),
  QuestionController.getQuestionsByCategory
)

// GET /api/v1/questions/:id - Get question by ID with options
router.get('/:id', validateUUID('id'), QuestionController.getQuestionById)

// GET /api/v1/questions/:id/options - Get question options
router.get('/:id/options', validateUUID('id'), QuestionController.getQuestionOptions)

// POST /api/v1/questions - Create new question (for admin/testing purposes)
router.post('/', validateQuestionData, QuestionController.createQuestion)

// PUT /api/v1/questions/:id - Update question (for admin/testing purposes)
router.put('/:id', validateUUID('id'), QuestionController.updateQuestion)

// DELETE /api/v1/questions/:id - Delete question (for admin/testing purposes)
router.delete('/:id', validateUUID('id'), QuestionController.deleteQuestion)

export { router as questionsRouter }
