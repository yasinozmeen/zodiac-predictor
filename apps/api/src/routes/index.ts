import { Router } from 'express'
import zodiacRoutes from './zodiac.js'
import surveyRoutes from './survey.js'

const router = Router()

// API version
router.get('/', (req, res) => {
  res.json({
    message: 'Zodiac Predictor API v1.0',
    version: '1.0.0',
    endpoints: {
      zodiac: '/api/zodiac',
      survey: '/api/survey',
    },
  })
})

// Route handlers
router.use('/zodiac', zodiacRoutes)
router.use('/survey', surveyRoutes)

export default router
