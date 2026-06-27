import type { SurveyData, SurveyResult, PersonalityAnalysis } from '@zodiac/shared'
import type { ZodiacService } from './ZodiacService.js'
import { generateId } from '../utils/helpers.js'

export interface SurveyRepository {
  store(id: string, result: SurveyResult): Promise<void>
  findById(id: string): Promise<SurveyResult | null>
}

class InMemorySurveyRepository implements SurveyRepository {
  private resultsStore = new Map<string, SurveyResult>()

  async store(id: string, result: SurveyResult): Promise<void> {
    this.resultsStore.set(id, result)
  }

  async findById(id: string): Promise<SurveyResult | null> {
    return this.resultsStore.get(id) || null
  }
}

export class SurveyService {
  constructor(
    private readonly zodiacService: ZodiacService,
    private readonly repository: SurveyRepository = new InMemorySurveyRepository()
  ) {}

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

    // Store result using repository pattern
    await this.repository.store(id, result)

    return result
  }

  async getResultsById(id: string): Promise<SurveyResult | null> {
    return this.repository.findById(id)
  }

  private generateRecommendations(analysis: PersonalityAnalysis): string[] {
    const recommendations = [
      `As a ${analysis.zodiacSign}, focus on developing your ${analysis.traits[0].toLowerCase()} nature`,
      `Your ${analysis.element} element suggests you thrive in dynamic environments`,
      `Consider exploring relationships with ${analysis.compatibility[0]?.sign2 || 'compatible'} signs`,
    ]

    return recommendations
  }

  private generateInsights(surveyData: SurveyData, analysis: PersonalityAnalysis): string[] {
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
