import type { ZodiacSign, PersonalityAnalysis, CompatibilityResult } from '@zodiac/shared'
import { ZodiacDataService } from './ZodiacDataService.js'

export class ZodiacService {
  async getAllSigns(): Promise<ReadonlyArray<ZodiacSign>> {
    return ZodiacDataService.getAllSigns()
  }

  async calculateCompatibility(sign1: string, sign2: string): Promise<CompatibilityResult> {
    const percentage = ZodiacDataService.getCompatibilityScore(sign1, sign2)

    return {
      sign1,
      sign2,
      percentage,
      description: ZodiacDataService.getCompatibilityDescription(percentage),
    }
  }

  async analyzePersonality(data: {
    birthDate: string
    birthTime?: string
    birthLocation: string
    personality?: string
  }): Promise<PersonalityAnalysis> {
    const zodiacSign = this.determineZodiacSign(data.birthDate)

    return {
      zodiacSign: zodiacSign.name,
      element: zodiacSign.element,
      traits: [...ZodiacDataService.getPersonalityTraits(zodiacSign.name)],
      strengths: [...ZodiacDataService.getStrengths(zodiacSign.name)],
      challenges: [...ZodiacDataService.getChallenges(zodiacSign.name)],
      compatibility: await this.getTopCompatibleSigns(zodiacSign.name),
    }
  }

  private determineZodiacSign(birthDate: string): ZodiacSign {
    const date = new Date(birthDate)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const birthDateStr = `${month}-${day}`

    const signs = ZodiacDataService.getAllSigns()
    for (const sign of signs) {
      if (this.isDateInRange(birthDateStr, sign.dates.start, sign.dates.end)) {
        return sign
      }
    }

    return signs[0] // Default to Aries
  }

  private isDateInRange(date: string, start: string, end: string): boolean {
    // Handle year-end crossover (like Capricorn)
    if (start > end) {
      return date >= start || date <= end
    }
    return date >= start && date <= end
  }

  private async getTopCompatibleSigns(sign: string): Promise<CompatibilityResult[]> {
    const allSigns = ZodiacDataService.getAllSigns().map(s => s.name)
    const compatibilityScores: { sign: string; score: number }[] = []

    for (const otherSign of allSigns) {
      if (otherSign !== sign) {
        const score = ZodiacDataService.getCompatibilityScore(sign, otherSign)
        compatibilityScores.push({ sign: otherSign, score })
      }
    }

    const topThree = compatibilityScores.sort((a, b) => b.score - a.score).slice(0, 3)

    const results: CompatibilityResult[] = []
    for (const { sign: compatibleSign } of topThree) {
      results.push(await this.calculateCompatibility(sign, compatibleSign))
    }

    return results
  }
}
