import { Router } from 'express'
import { SurveyController } from '../controllers/SurveyController.js'

const router = Router()
const surveyController = new SurveyController()

// POST /api/survey/submit - Submit survey data and get results
router.post('/submit', surveyController.submitSurvey)

// GET /api/survey/results/:id - Get survey results by ID
router.get('/results/:id', surveyController.getResults)

export default router
