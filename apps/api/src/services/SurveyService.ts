import { SurveyData, SurveyResult } from '@zodiac/shared'
import { ZodiacService } from './ZodiacService.js'
import { generateId } from '../utils/helpers.js'

export class SurveyService {
  private zodiacService: ZodiacService
  private resultsStore: Map<string, SurveyResult> = new Map()

  constructor() {
    this.zodiacService = new ZodiacService()
  }

  async processSurvey(surveyData: SurveyData): Promise<SurveyResult> {
    // Generate unique ID for this survey
    const id = generateId()

    // Get personality analysis from zodiac service
    const personalityAnalysis = await this.zodiacService.analyzePersonality({
      birthDate: surveyData.birthDate,
      birthTime: surveyData.birthTime,
      birthLocation: surveyData.birthLocation,
      personality: surveyData.personality,
    })

    // Create comprehensive result
    const result: SurveyResult = {
      id,
      timestamp: new Date().toISOString(),
      surveyData,
      personalityAnalysis,
      recommendations: this.generateRecommendations(personalityAnalysis),
      insights: this.generateInsights(surveyData, personalityAnalysis),
    }

    // Store result (in production, this would be in a database)
    this.resultsStore.set(id, result)

    return result
  }

  async getResultsById(id: string): Promise<SurveyResult | null> {
    return this.resultsStore.get(id) || null
  }

  private generateRecommendations(analysis: any): string[] {
    const recommendations = [
      `As a ${analysis.zodiacSign}, focus on developing your ${analysis.traits[0].toLowerCase()} nature`,
      `Your ${analysis.element} element suggests you thrive in dynamic environments`,
      `Consider exploring relationships with ${analysis.compatibility[0]?.sign2 || 'compatible'} signs`,
    ]

    return recommendations
  }

  private generateInsights(surveyData: SurveyData, analysis: any): string[] {
    const insights = [
      `Your birth location in ${surveyData.birthLocation} adds unique cosmic influences`,
      `The combination of your personality traits suggests strong ${analysis.element} energy`,
      `Your interests align well with typical ${analysis.zodiacSign} characteristics`,
    ]

    if (surveyData.interests && surveyData.interests.length > 0) {
      insights.push(
        `Your interest in ${surveyData.interests[0]} reflects your ${analysis.traits[0].toLowerCase()} nature`
      )
    }

    return insights
  }
}
