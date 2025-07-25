import express from 'express'
import zodiacRoutes from './zodiac.js'
import surveyRoutes from './survey.js'

const router = express.Router()

// API version
router.get('/', (req: express.Request, res: express.Response) => {
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
