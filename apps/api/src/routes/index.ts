import express from 'express'
import zodiacRoutes from './zodiac.js'
import surveyRoutes from './survey.js'
import { categoriesRouter } from './categories.js'
import { questionsRouter } from './questions.js'
import { healthRouter } from './health.js'

const router = express.Router()

// API version
router.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Zodiac Predictor API v1.0',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      categories: '/api/v1/categories',
      questions: '/api/v1/questions',
      zodiac: '/api/v1/zodiac',
      survey: '/api/v1/survey',
    },
  })
})

// Route handlers
router.use('/health', healthRouter)
router.use('/categories', categoriesRouter)
router.use('/questions', questionsRouter)
router.use('/zodiac', zodiacRoutes)
router.use('/survey', surveyRoutes)

export default router
