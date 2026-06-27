import { ZodiacDataService } from '../../services/ZodiacDataService.js'

describe('ZodiacDataService', () => {
  describe('getAllSigns', () => {
    it('should return all 12 zodiac signs', () => {
      const signs = ZodiacDataService.getAllSigns()

      expect(signs).toHaveLength(12)
      expect(signs.map(s => s.name)).toEqual([
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ])
    })

    it('should return readonly array with correct properties', () => {
      const signs = ZodiacDataService.getAllSigns()

      signs.forEach(sign => {
        expect(sign).toHaveProperty('name')
        expect(sign).toHaveProperty('symbol')
        expect(sign).toHaveProperty('element')
        expect(sign).toHaveProperty('dates')
        expect(sign.dates).toHaveProperty('start')
        expect(sign.dates).toHaveProperty('end')
      })
    })

    it('should have correct elements for each sign', () => {
      const signs = ZodiacDataService.getAllSigns()
      const fireElements = signs.filter(s => s.element === 'Fire')
      const earthElements = signs.filter(s => s.element === 'Earth')
      const airElements = signs.filter(s => s.element === 'Air')
      const waterElements = signs.filter(s => s.element === 'Water')

      expect(fireElements).toHaveLength(3)
      expect(earthElements).toHaveLength(3)
      expect(airElements).toHaveLength(3)
      expect(waterElements).toHaveLength(3)
    })
  })

  describe('getCompatibilityScore', () => {
    it('should return scores for compatible signs', () => {
      const ariesLeoScore = ZodiacDataService.getCompatibilityScore('Aries', 'Leo')
      const leoAriesScore = ZodiacDataService.getCompatibilityScore('Leo', 'Aries')

      expect(ariesLeoScore).toBe(95)
      expect(leoAriesScore).toBe(95)
    })

    it('should return random score for unknown combinations', () => {
      const score = ZodiacDataService.getCompatibilityScore('UnknownSign', 'AnotherUnknown')

      expect(score).toBeGreaterThanOrEqual(50)
      expect(score).toBeLessThanOrEqual(90)
    })

    it('should return consistent scores for same combination', () => {
      // Mock Math.random for consistency
      const originalRandom = Math.random
      Math.random = jest.fn(() => 0.5)

      const score1 = ZodiacDataService.getCompatibilityScore('Unknown1', 'Unknown2')
      const score2 = ZodiacDataService.getCompatibilityScore('Unknown1', 'Unknown2')

      expect(score1).toBe(score2)

      Math.random = originalRandom
    })

    it('should handle bidirectional compatibility', () => {
      const score1 = ZodiacDataService.getCompatibilityScore('Taurus', 'Virgo')
      const score2 = ZodiacDataService.getCompatibilityScore('Virgo', 'Taurus')

      expect(score1).toBe(score2)
      expect(score1).toBe(95)
    })
  })

  describe('getPersonalityTraits', () => {
    it('should return traits for all zodiac signs', () => {
      const signs = [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ]

      signs.forEach(sign => {
        const traits = ZodiacDataService.getPersonalityTraits(sign)
        expect(traits).toHaveLength(3)
        expect(traits.every(trait => typeof trait === 'string')).toBe(true)
      })
    })

    it('should return default traits for unknown signs', () => {
      const traits = ZodiacDataService.getPersonalityTraits('UnknownSign')

      expect(traits).toEqual(['Unique', 'Special', 'Individual'])
    })

    it('should return specific traits for known signs', () => {
      const ariesTraits = ZodiacDataService.getPersonalityTraits('Aries')

      expect(ariesTraits).toEqual(['Energetic', 'Confident', 'Pioneering'])
    })
  })

  describe('getStrengths', () => {
    it('should return strengths for all zodiac signs', () => {
      const signs = [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ]

      signs.forEach(sign => {
        const strengths = ZodiacDataService.getStrengths(sign)
        expect(strengths).toHaveLength(3)
        expect(strengths.every(strength => typeof strength === 'string')).toBe(true)
      })
    })

    it('should return default strengths for unknown signs', () => {
      const strengths = ZodiacDataService.getStrengths('UnknownSign')

      expect(strengths).toEqual(['Determined', 'Loyal', 'Creative'])
    })

    it('should return positive strength descriptions', () => {
      const leoStrengths = ZodiacDataService.getStrengths('Leo')

      expect(leoStrengths).toEqual(['Inspiring leader', 'Creative visionary', 'Generous heart'])
    })
  })

  describe('getChallenges', () => {
    it('should return challenges for all zodiac signs', () => {
      const signs = [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ]

      signs.forEach(sign => {
        const challenges = ZodiacDataService.getChallenges(sign)
        expect(challenges).toHaveLength(3)
        expect(challenges.every(challenge => typeof challenge === 'string')).toBe(true)
      })
    })

    it('should return default challenges for unknown signs', () => {
      const challenges = ZodiacDataService.getChallenges('UnknownSign')

      expect(challenges).toEqual(['Growing', 'Learning', 'Evolving'])
    })

    it('should return constructive challenge descriptions', () => {
      const libraChallenges = ZodiacDataService.getChallenges('Libra')

      expect(libraChallenges).toEqual([
        'Can be indecisive',
        'Avoids conflict',
        'Sometimes people-pleasing',
      ])
    })
  })

  describe('getCompatibilityDescription', () => {
    it('should return appropriate description for high percentages', () => {
      expect(ZodiacDataService.getCompatibilityDescription(95)).toBe('Perfect cosmic match')
      expect(ZodiacDataService.getCompatibilityDescription(90)).toBe('Perfect cosmic match')
    })

    it('should return appropriate description for good percentages', () => {
      expect(ZodiacDataService.getCompatibilityDescription(85)).toBe('Great compatibility')
      expect(ZodiacDataService.getCompatibilityDescription(80)).toBe('Great compatibility')
    })

    it('should return appropriate description for moderate percentages', () => {
      expect(ZodiacDataService.getCompatibilityDescription(75)).toBe('Good potential together')
      expect(ZodiacDataService.getCompatibilityDescription(70)).toBe('Good potential together')
    })

    it('should return appropriate description for low-moderate percentages', () => {
      expect(ZodiacDataService.getCompatibilityDescription(65)).toBe('Moderate compatibility')
      expect(ZodiacDataService.getCompatibilityDescription(60)).toBe('Moderate compatibility')
    })

    it('should return appropriate description for low percentages', () => {
      expect(ZodiacDataService.getCompatibilityDescription(55)).toBe('Challenging but possible')
      expect(ZodiacDataService.getCompatibilityDescription(50)).toBe('Challenging but possible')
    })

    it('should handle edge cases', () => {
      expect(ZodiacDataService.getCompatibilityDescription(100)).toBe('Perfect cosmic match')
      expect(ZodiacDataService.getCompatibilityDescription(0)).toBe('Challenging but possible')
    })
  })
})
