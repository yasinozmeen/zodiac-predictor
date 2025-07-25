import express from 'express'
import { SurveyService } from '../services/SurveyService.js'

export class SurveyController {
  private surveyService: SurveyService

  constructor() {
    this.surveyService = new SurveyService()
  }

  submitSurvey = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const surveyData = req.body

      // Basic validation
      if (!surveyData.birthDate || !surveyData.birthLocation) {
        res.status(400).json({
          success: false,
          message: 'Birth date and location are required',
        })
        return
      }

      const results = await this.surveyService.processSurvey(surveyData)

      res.json({
        success: true,
        data: results,
      })
    } catch (error) {
      next(error)
    }
  }

  getResults = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params
      const results = await this.surveyService.getResultsById(id)

      if (!results) {
        res.status(404).json({
          success: false,
          message: 'Results not found',
        })
        return
      }

      res.json({
        success: true,
        data: results,
      })
    } catch (error) {
      next(error)
    }
  }
}
