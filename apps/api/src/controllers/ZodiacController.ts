import { Request, Response, NextFunction } from 'express'
import { ZodiacService } from '../services/ZodiacService.js'

export class ZodiacController {
  private zodiacService: ZodiacService

  constructor() {
    this.zodiacService = new ZodiacService()
  }

  getAllSigns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signs = await this.zodiacService.getAllSigns()
      res.json({
        success: true,
        data: signs,
      })
    } catch (error) {
      next(error)
    }
  }

  getCompatibility = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sign1, sign2 } = req.params
      const compatibility = await this.zodiacService.calculateCompatibility(sign1, sign2)

      res.json({
        success: true,
        data: compatibility,
      })
    } catch (error) {
      next(error)
    }
  }

  analyzePersonality = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { birthDate, birthTime, birthLocation, personality } = req.body

      if (!birthDate || !birthLocation) {
        res.status(400).json({
          success: false,
          message: 'Birth date and location are required',
        })
        return
      }

      const analysis = await this.zodiacService.analyzePersonality({
        birthDate,
        birthTime,
        birthLocation,
        personality,
      })

      res.json({
        success: true,
        data: analysis,
      })
    } catch (error) {
      next(error)
    }
  }
}
