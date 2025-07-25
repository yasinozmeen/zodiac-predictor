import { supabase } from '../utils/supabase.js'
import type {
  ZodiacScoringModel,
  CreateZodiacScoringData,
  UpdateZodiacScoringData,
  ZodiacScoringWithOption,
  ZodiacSignType,
  ZodiacCalculationResult,
} from '../models/ZodiacScoring.js'

export class ZodiacScoringService {
  // Create new zodiac scoring entry
  static async create(data: CreateZodiacScoringData): Promise<ZodiacScoringModel> {
    const { data: result, error } = await supabase
      .from('zodiac_scoring')
      .insert({
        question_option_id: data.questionOptionId,
        zodiac_sign: data.zodiacSign,
        score_value: data.scoreValue,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create zodiac scoring: ${error.message}`)
    }

    return {
      id: result.id,
      questionOptionId: result.question_option_id,
      zodiacSign: result.zodiac_sign,
      scoreValue: result.score_value,
    }
  }

  // Get all zodiac scoring entries
  static async getAll(): Promise<ZodiacScoringModel[]> {
    const { data, error } = await supabase
      .from('zodiac_scoring')
      .select('*')
      .order('zodiac_sign', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch zodiac scoring: ${error.message}`)
    }

    return data.map((item: any) => ({
      id: item.id,
      questionOptionId: item.question_option_id,
      zodiacSign: item.zodiac_sign,
      scoreValue: item.score_value,
    }))
  }

  // Get zodiac scoring by option ID
  static async getByOptionId(questionOptionId: string): Promise<ZodiacScoringModel[]> {
    const { data, error } = await supabase
      .from('zodiac_scoring')
      .select('*')
      .eq('question_option_id', questionOptionId)
      .order('score_value', { ascending: false })

    if (error) {
      // Handle invalid UUID format gracefully
      if (error.message.includes('invalid input syntax for type uuid')) {
        return []
      }
      throw new Error(`Failed to fetch zodiac scoring for option: ${error.message}`)
    }

    return data.map((item: any) => ({
      id: item.id,
      questionOptionId: item.question_option_id,
      zodiacSign: item.zodiac_sign,
      scoreValue: item.score_value,
    }))
  }

  // Get zodiac scoring by zodiac sign
  static async getByZodiacSign(zodiacSign: ZodiacSignType): Promise<ZodiacScoringModel[]> {
    const { data, error } = await supabase
      .from('zodiac_scoring')
      .select('*')
      .eq('zodiac_sign', zodiacSign)
      .order('score_value', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch zodiac scoring for sign: ${error.message}`)
    }

    return data.map((item: any) => ({
      id: item.id,
      questionOptionId: item.question_option_id,
      zodiacSign: item.zodiac_sign,
      scoreValue: item.score_value,
    }))
  }

  // Get zodiac scoring with option details
  static async getWithOptionDetails(): Promise<ZodiacScoringWithOption[]> {
    const { data, error } = await supabase
      .from('zodiac_scoring')
      .select(
        `
        *,
        question_options!inner(
          id,
          question_id,
          option_text,
          order_index
        )
      `
      )
      .order('zodiac_sign', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch zodiac scoring with details: ${error.message}`)
    }

    return data.map((item: any) => ({
      id: item.id,
      questionOptionId: item.question_option_id,
      zodiacSign: item.zodiac_sign,
      scoreValue: item.score_value,
      questionOption: {
        id: item.question_options.id,
        questionId: item.question_options.question_id,
        optionText: item.question_options.option_text,
        orderIndex: item.question_options.order_index,
      },
    }))
  }

  // Calculate zodiac scores for a session
  static async calculateZodiacScores(sessionId: string): Promise<ZodiacCalculationResult> {
    // Get all responses for the session with scoring data
    const { data: responses, error } = await supabase
      .from('user_responses')
      .select(
        `
        *,
        zodiac_scoring!inner(
          zodiac_sign,
          score_value
        )
      `
      )
      .eq('session_id', sessionId)

    if (error) {
      throw new Error(`Failed to fetch responses for scoring: ${error.message}`)
    }

    if (!responses || responses.length === 0) {
      throw new Error('No responses found for session')
    }

    // Initialize scores for all zodiac signs
    const scores: Record<ZodiacSignType, number> = {
      aries: 0,
      taurus: 0,
      gemini: 0,
      cancer: 0,
      leo: 0,
      virgo: 0,
      libra: 0,
      scorpio: 0,
      sagittarius: 0,
      capricorn: 0,
      aquarius: 0,
      pisces: 0,
    }

    // Calculate total scores for each zodiac sign
    responses.forEach((response: any) => {
      if (Array.isArray(response.zodiac_scoring)) {
        response.zodiac_scoring.forEach((scoring: any) => {
          const sign = scoring.zodiac_sign as ZodiacSignType
          scores[sign] += scoring.score_value
        })
      }
    })

    // Find the highest scoring sign
    const sortedScores = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([sign, score]) => ({ zodiacSign: sign as ZodiacSignType, totalScore: score }))

    const predictedSign = sortedScores[0].zodiacSign
    const maxScore = sortedScores[0].totalScore
    const totalPossibleScore = responses.length * 10 // Assuming max score per question is 10
    const confidence = Math.round((maxScore / totalPossibleScore) * 100)

    return {
      predictedSign,
      scores,
      confidence,
      sessionId,
    }
  }

  // Get scoring statistics
  static async getScoringStats(): Promise<{
    totalEntries: number
    signDistribution: Record<ZodiacSignType, number>
    averageScorePerSign: Record<ZodiacSignType, number>
  }> {
    const { data, error } = await supabase.from('zodiac_scoring').select('zodiac_sign, score_value')

    if (error) {
      throw new Error(`Failed to fetch scoring statistics: ${error.message}`)
    }

    const signDistribution: Record<ZodiacSignType, number> = {
      aries: 0,
      taurus: 0,
      gemini: 0,
      cancer: 0,
      leo: 0,
      virgo: 0,
      libra: 0,
      scorpio: 0,
      sagittarius: 0,
      capricorn: 0,
      aquarius: 0,
      pisces: 0,
    }

    const signScoreSums: Record<ZodiacSignType, number> = { ...signDistribution }

    data.forEach((item: any) => {
      const sign = item.zodiac_sign as ZodiacSignType
      signDistribution[sign]++
      signScoreSums[sign] += item.score_value
    })

    const averageScorePerSign: Record<ZodiacSignType, number> = {} as Record<ZodiacSignType, number>
    Object.keys(signDistribution).forEach(sign => {
      const signKey = sign as ZodiacSignType
      averageScorePerSign[signKey] =
        signDistribution[signKey] > 0
          ? Math.round((signScoreSums[signKey] / signDistribution[signKey]) * 100) / 100
          : 0
    })

    return {
      totalEntries: data.length,
      signDistribution,
      averageScorePerSign,
    }
  }

  // Update zodiac scoring entry
  static async update(id: string, data: UpdateZodiacScoringData): Promise<ZodiacScoringModel> {
    const updateData: any = {}
    if (data.zodiacSign) updateData.zodiac_sign = data.zodiacSign
    if (data.scoreValue !== undefined) updateData.score_value = data.scoreValue

    const { data: result, error } = await supabase
      .from('zodiac_scoring')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update zodiac scoring: ${error.message}`)
    }

    return {
      id: result.id,
      questionOptionId: result.question_option_id,
      zodiacSign: result.zodiac_sign,
      scoreValue: result.score_value,
    }
  }

  // Delete zodiac scoring entry
  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('zodiac_scoring').delete().eq('id', id)

    if (error) {
      // Handle invalid UUID format gracefully for delete operations
      if (error.message.includes('invalid input syntax for type uuid')) {
        return // No-op for invalid IDs
      }
      throw new Error(`Failed to delete zodiac scoring: ${error.message}`)
    }
  }

  // Bulk create zodiac scoring entries
  static async bulkCreate(entries: CreateZodiacScoringData[]): Promise<ZodiacScoringModel[]> {
    const insertData = entries.map(entry => ({
      question_option_id: entry.questionOptionId,
      zodiac_sign: entry.zodiacSign,
      score_value: entry.scoreValue,
    }))

    const { data, error } = await supabase.from('zodiac_scoring').insert(insertData).select()

    if (error) {
      throw new Error(`Failed to bulk create zodiac scoring: ${error.message}`)
    }

    return data.map((item: any) => ({
      id: item.id,
      questionOptionId: item.question_option_id,
      zodiacSign: item.zodiac_sign,
      scoreValue: item.score_value,
    }))
  }
}
