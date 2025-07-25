import type { ZodiacSign, PersonalityAnalysis, CompatibilityResult } from '@zodiac/shared'

export class ZodiacService {
  private zodiacSigns: ZodiacSign[] = [
    { name: 'Aries', symbol: '♈', element: 'Fire', dates: { start: '03-21', end: '04-19' } },
    { name: 'Taurus', symbol: '♉', element: 'Earth', dates: { start: '04-20', end: '05-20' } },
    { name: 'Gemini', symbol: '♊', element: 'Air', dates: { start: '05-21', end: '06-20' } },
    { name: 'Cancer', symbol: '♋', element: 'Water', dates: { start: '06-21', end: '07-22' } },
    { name: 'Leo', symbol: '♌', element: 'Fire', dates: { start: '07-23', end: '08-22' } },
    { name: 'Virgo', symbol: '♍', element: 'Earth', dates: { start: '08-23', end: '09-22' } },
    { name: 'Libra', symbol: '♎', element: 'Air', dates: { start: '09-23', end: '10-22' } },
    { name: 'Scorpio', symbol: '♏', element: 'Water', dates: { start: '10-23', end: '11-21' } },
    { name: 'Sagittarius', symbol: '♐', element: 'Fire', dates: { start: '11-22', end: '12-21' } },
    { name: 'Capricorn', symbol: '♑', element: 'Earth', dates: { start: '12-22', end: '01-19' } },
    { name: 'Aquarius', symbol: '♒', element: 'Air', dates: { start: '01-20', end: '02-18' } },
    { name: 'Pisces', symbol: '♓', element: 'Water', dates: { start: '02-19', end: '03-20' } },
  ]

  async getAllSigns(): Promise<ZodiacSign[]> {
    return this.zodiacSigns
  }

  async calculateCompatibility(sign1: string, sign2: string): Promise<CompatibilityResult> {
    // Mock compatibility calculation - replace with real logic
    const compatibilityMap: Record<string, Record<string, number>> = {
      Aries: { Leo: 95, Sagittarius: 90, Gemini: 85, Aquarius: 80 },
      Taurus: { Virgo: 95, Capricorn: 90, Cancer: 85, Pisces: 80 },
      Gemini: { Libra: 95, Aquarius: 90, Aries: 85, Leo: 80 },
      Cancer: { Scorpio: 95, Pisces: 90, Taurus: 85, Virgo: 80 },
      Leo: { Aries: 95, Sagittarius: 90, Gemini: 85, Libra: 80 },
      Virgo: { Taurus: 95, Capricorn: 90, Cancer: 85, Scorpio: 80 },
      Libra: { Gemini: 95, Aquarius: 90, Leo: 85, Sagittarius: 80 },
      Scorpio: { Cancer: 95, Pisces: 90, Virgo: 85, Capricorn: 80 },
      Sagittarius: { Aries: 95, Leo: 90, Libra: 85, Aquarius: 80 },
      Capricorn: { Taurus: 95, Virgo: 90, Scorpio: 85, Pisces: 80 },
      Aquarius: { Gemini: 95, Libra: 90, Aries: 85, Sagittarius: 80 },
      Pisces: { Cancer: 95, Scorpio: 90, Taurus: 85, Capricorn: 80 },
    }

    const percentage =
      compatibilityMap[sign1]?.[sign2] ||
      compatibilityMap[sign2]?.[sign1] ||
      Math.floor(Math.random() * 40) + 50 // Random between 50-90

    return {
      sign1,
      sign2,
      percentage,
      description: this.getCompatibilityDescription(percentage),
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
      traits: this.getPersonalityTraits(zodiacSign.name),
      strengths: this.getStrengths(zodiacSign.name),
      challenges: this.getChallenges(zodiacSign.name),
      compatibility: await this.getTopCompatibleSigns(zodiacSign.name),
    }
  }

  private determineZodiacSign(birthDate: string): ZodiacSign {
    const date = new Date(birthDate)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const birthDateStr = `${month}-${day}`

    for (const sign of this.zodiacSigns) {
      if (this.isDateInRange(birthDateStr, sign.dates.start, sign.dates.end)) {
        return sign
      }
    }

    return this.zodiacSigns[0] // Default to Aries
  }

  private isDateInRange(date: string, start: string, end: string): boolean {
    // Handle year-end crossover (like Capricorn)
    if (start > end) {
      return date >= start || date <= end
    }
    return date >= start && date <= end
  }

  private getPersonalityTraits(sign: string): string[] {
    const traitsMap: Record<string, string[]> = {
      Aries: ['Energetic', 'Confident', 'Pioneering'],
      Taurus: ['Reliable', 'Patient', 'Practical'],
      Gemini: ['Adaptable', 'Curious', 'Communicative'],
      Cancer: ['Nurturing', 'Intuitive', 'Protective'],
      Leo: ['Generous', 'Creative', 'Dramatic'],
      Virgo: ['Analytical', 'Helpful', 'Precise'],
      Libra: ['Diplomatic', 'Artistic', 'Social'],
      Scorpio: ['Intense', 'Mysterious', 'Transformative'],
      Sagittarius: ['Adventurous', 'Philosophical', 'Optimistic'],
      Capricorn: ['Ambitious', 'Disciplined', 'Responsible'],
      Aquarius: ['Innovative', 'Independent', 'Humanitarian'],
      Pisces: ['Compassionate', 'Artistic', 'Intuitive'],
    }

    return traitsMap[sign] || ['Unique', 'Special', 'Individual']
  }

  private getStrengths(sign: string): string[] {
    const strengthsMap: Record<string, string[]> = {
      Libra: ['Great listener', 'Balanced perspective', 'Natural mediator'],
      Leo: ['Natural leader', 'Inspiring', 'Generous heart'],
      Gemini: ['Quick thinker', 'Versatile', 'Great communicator'],
      // Add more as needed
    }

    return strengthsMap[sign] || ['Determined', 'Loyal', 'Creative']
  }

  private getChallenges(sign: string): string[] {
    const challengesMap: Record<string, string[]> = {
      Libra: ['Indecisive', 'Avoids conflict', 'Perfectionist'],
      Leo: ['Can be prideful', 'Needs attention', 'Sometimes dramatic'],
      Gemini: ['Can be scattered', 'Restless', 'Inconsistent'],
      // Add more as needed
    }

    return challengesMap[sign] || ['Impatient', 'Stubborn', 'Overly critical']
  }

  private async getTopCompatibleSigns(sign: string): Promise<CompatibilityResult[]> {
    const compatibleSigns = ['Leo', 'Gemini', 'Aquarius'] // Mock data
    const results: CompatibilityResult[] = []

    for (const compatibleSign of compatibleSigns) {
      if (compatibleSign !== sign) {
        results.push(await this.calculateCompatibility(sign, compatibleSign))
      }
    }

    return results.slice(0, 3) // Top 3
  }

  private getCompatibilityDescription(percentage: number): string {
    if (percentage >= 90) return 'Perfect cosmic match'
    if (percentage >= 80) return 'Great compatibility'
    if (percentage >= 70) return 'Good potential together'
    if (percentage >= 60) return 'Moderate compatibility'
    return 'Challenging but possible'
  }
}
