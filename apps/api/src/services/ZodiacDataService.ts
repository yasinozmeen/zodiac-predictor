import type { ZodiacSign } from '@zodiac/shared'

export class ZodiacDataService {
  private static readonly ZODIAC_SIGNS: ReadonlyArray<ZodiacSign> = [
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
  ] as const

  private static readonly COMPATIBILITY_MATRIX: ReadonlyMap<string, ReadonlyMap<string, number>> =
    new Map([
      [
        'Aries',
        new Map([
          ['Leo', 95],
          ['Sagittarius', 90],
          ['Gemini', 85],
          ['Aquarius', 80],
        ]),
      ],
      [
        'Taurus',
        new Map([
          ['Virgo', 95],
          ['Capricorn', 90],
          ['Cancer', 85],
          ['Pisces', 80],
        ]),
      ],
      [
        'Gemini',
        new Map([
          ['Libra', 95],
          ['Aquarius', 90],
          ['Aries', 85],
          ['Leo', 80],
        ]),
      ],
      [
        'Cancer',
        new Map([
          ['Scorpio', 95],
          ['Pisces', 90],
          ['Taurus', 85],
          ['Virgo', 80],
        ]),
      ],
      [
        'Leo',
        new Map([
          ['Aries', 95],
          ['Sagittarius', 90],
          ['Gemini', 85],
          ['Libra', 80],
        ]),
      ],
      [
        'Virgo',
        new Map([
          ['Taurus', 95],
          ['Capricorn', 90],
          ['Cancer', 85],
          ['Scorpio', 80],
        ]),
      ],
      [
        'Libra',
        new Map([
          ['Gemini', 95],
          ['Aquarius', 90],
          ['Leo', 85],
          ['Sagittarius', 80],
        ]),
      ],
      [
        'Scorpio',
        new Map([
          ['Cancer', 95],
          ['Pisces', 90],
          ['Virgo', 85],
          ['Capricorn', 80],
        ]),
      ],
      [
        'Sagittarius',
        new Map([
          ['Aries', 95],
          ['Leo', 90],
          ['Libra', 85],
          ['Aquarius', 80],
        ]),
      ],
      [
        'Capricorn',
        new Map([
          ['Taurus', 95],
          ['Virgo', 90],
          ['Scorpio', 85],
          ['Pisces', 80],
        ]),
      ],
      [
        'Aquarius',
        new Map([
          ['Gemini', 95],
          ['Libra', 90],
          ['Aries', 85],
          ['Sagittarius', 80],
        ]),
      ],
      [
        'Pisces',
        new Map([
          ['Cancer', 95],
          ['Scorpio', 90],
          ['Taurus', 85],
          ['Capricorn', 80],
        ]),
      ],
    ])

  private static readonly PERSONALITY_TRAITS: ReadonlyMap<string, ReadonlyArray<string>> = new Map([
    ['Aries', ['Energetic', 'Confident', 'Pioneering']],
    ['Taurus', ['Reliable', 'Patient', 'Practical']],
    ['Gemini', ['Adaptable', 'Curious', 'Communicative']],
    ['Cancer', ['Nurturing', 'Intuitive', 'Protective']],
    ['Leo', ['Generous', 'Creative', 'Dramatic']],
    ['Virgo', ['Analytical', 'Helpful', 'Precise']],
    ['Libra', ['Diplomatic', 'Artistic', 'Social']],
    ['Scorpio', ['Intense', 'Mysterious', 'Transformative']],
    ['Sagittarius', ['Adventurous', 'Philosophical', 'Optimistic']],
    ['Capricorn', ['Ambitious', 'Disciplined', 'Responsible']],
    ['Aquarius', ['Innovative', 'Independent', 'Humanitarian']],
    ['Pisces', ['Compassionate', 'Artistic', 'Intuitive']],
  ])

  private static readonly STRENGTHS: ReadonlyMap<string, ReadonlyArray<string>> = new Map([
    ['Aries', ['Natural leader', 'Bold decision-maker', 'Energetic motivator']],
    ['Taurus', ['Reliable partner', 'Patient listener', 'Practical problem-solver']],
    ['Gemini', ['Quick thinker', 'Versatile communicator', 'Adaptable learner']],
    ['Cancer', ['Empathetic caregiver', 'Intuitive guide', 'Loyal protector']],
    ['Leo', ['Inspiring leader', 'Creative visionary', 'Generous heart']],
    ['Virgo', ['Detail-oriented', 'Helpful supporter', 'Analytical thinker']],
    ['Libra', ['Great mediator', 'Balanced perspective', 'Natural diplomat']],
    ['Scorpio', ['Deep insight', 'Transformative power', 'Intense focus']],
    ['Sagittarius', ['Adventurous spirit', 'Philosophical wisdom', 'Optimistic outlook']],
    ['Capricorn', ['Strong discipline', 'Ambitious drive', 'Responsible leader']],
    ['Aquarius', ['Innovative thinking', 'Independent spirit', 'Humanitarian values']],
    ['Pisces', ['Compassionate soul', 'Artistic creativity', 'Intuitive wisdom']],
  ])

  private static readonly CHALLENGES: ReadonlyMap<string, ReadonlyArray<string>> = new Map([
    ['Aries', ['Can be impulsive', 'Sometimes impatient', 'May act without thinking']],
    ['Taurus', ['Can be stubborn', 'Resistant to change', 'Sometimes possessive']],
    ['Gemini', ['Can be scattered', 'Sometimes inconsistent', 'May avoid commitment']],
    ['Cancer', ['Can be overly sensitive', 'Sometimes moody', 'May retreat when hurt']],
    ['Leo', ['Can be prideful', 'Needs attention', 'Sometimes dramatic']],
    ['Virgo', ['Can be overly critical', 'Sometimes perfectionist', 'May worry too much']],
    ['Libra', ['Can be indecisive', 'Avoids conflict', 'Sometimes people-pleasing']],
    ['Scorpio', ['Can be secretive', 'Sometimes jealous', 'May hold grudges']],
    ['Sagittarius', ['Can be restless', 'Sometimes tactless', 'May avoid responsibility']],
    [
      'Capricorn',
      ['Can be pessimistic', 'Sometimes rigid', 'May prioritize work over relationships'],
    ],
    ['Aquarius', ['Can be detached', 'Sometimes unpredictable', 'May seem aloof']],
    ['Pisces', ['Can be overly emotional', 'Sometimes escapist', 'May lack boundaries']],
  ])

  static getAllSigns(): ReadonlyArray<ZodiacSign> {
    return this.ZODIAC_SIGNS
  }

  static getCompatibilityScore(sign1: string, sign2: string): number {
    return (
      this.COMPATIBILITY_MATRIX.get(sign1)?.get(sign2) ||
      this.COMPATIBILITY_MATRIX.get(sign2)?.get(sign1) ||
      Math.floor(Math.random() * 40) + 50
    )
  }

  static getPersonalityTraits(sign: string): ReadonlyArray<string> {
    return this.PERSONALITY_TRAITS.get(sign) || ['Unique', 'Special', 'Individual']
  }

  static getStrengths(sign: string): ReadonlyArray<string> {
    return this.STRENGTHS.get(sign) || ['Determined', 'Loyal', 'Creative']
  }

  static getChallenges(sign: string): ReadonlyArray<string> {
    return this.CHALLENGES.get(sign) || ['Growing', 'Learning', 'Evolving']
  }

  static getCompatibilityDescription(percentage: number): string {
    if (percentage >= 90) return 'Perfect cosmic match'
    if (percentage >= 80) return 'Great compatibility'
    if (percentage >= 70) return 'Good potential together'
    if (percentage >= 60) return 'Moderate compatibility'
    return 'Challenging but possible'
  }
}
