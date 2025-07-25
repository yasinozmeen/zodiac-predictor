import { Router } from 'express'
import { ZodiacController } from '../controllers/ZodiacController.js'

const router = Router()
const zodiacController = new ZodiacController()

// GET /api/zodiac/signs - Get all zodiac signs
router.get('/signs', zodiacController.getAllSigns)

// GET /api/zodiac/compatibility/:sign1/:sign2 - Get compatibility between two signs
router.get('/compatibility/:sign1/:sign2', zodiacController.getCompatibility)

// POST /api/zodiac/analyze - Analyze personality based on birth data
router.post('/analyze', zodiacController.analyzePersonality)

export default router
