import { ZodiacService } from '../../services/ZodiacService.js'
// Test file for ZodiacService

describe('ZodiacService', () => {
  let zodiacService: ZodiacService

  beforeEach(() => {
    zodiacService = new ZodiacService()
  })

  describe('getAllSigns', () => {
    it('should return all 12 zodiac signs', async () => {
      const signs = await zodiacService.getAllSigns()

      expect(signs).toHaveLength(12)
      expect(signs[0]).toHaveProperty('name', 'Aries')
      expect(signs[0]).toHaveProperty('symbol', '♈')
      expect(signs[0]).toHaveProperty('element', 'Fire')
      expect(signs[0]).toHaveProperty('dates')
    })

    it('should return readonly array of signs', async () => {
      const signs = await zodiacService.getAllSigns()

      // Type assertion to test readonly nature
      expect(Array.isArray(signs)).toBe(true)
      expect(
        signs.every(
          sign =>
            typeof sign.name === 'string' &&
            typeof sign.symbol === 'string' &&
            typeof sign.element === 'string'
        )
      ).toBe(true)
    })
  })

  describe('calculateCompatibility', () => {
    it('should calculate compatibility between two signs', async () => {
      const result = await zodiacService.calculateCompatibility('Aries', 'Leo')

      expect(result).toHaveProperty('sign1', 'Aries')
      expect(result).toHaveProperty('sign2', 'Leo')
      expect(result).toHaveProperty('percentage')
      expect(result).toHaveProperty('description')
      expect(typeof result.percentage).toBe('number')
      expect(result.percentage).toBeGreaterThanOrEqual(50)
      expect(result.percentage).toBeLessThanOrEqual(100)
    })

    it('should return high compatibility for fire signs', async () => {
      const result = await zodiacService.calculateCompatibility('Aries', 'Leo')

      expect(result.percentage).toBeGreaterThanOrEqual(80)
      expect(result.description).toContain('compatibility')
    })

    it('should handle reverse order compatibility', async () => {
      const result1 = await zodiacService.calculateCompatibility('Leo', 'Aries')
      const result2 = await zodiacService.calculateCompatibility('Aries', 'Leo')

      expect(result1.percentage).toBe(result2.percentage)
    })

    it('should provide appropriate descriptions for different percentage ranges', async () => {
      const highCompat = await zodiacService.calculateCompatibility('Aries', 'Leo')
      expect(highCompat.description).toMatch(/Perfect cosmic match|Great compatibility/)
    })
  })

  describe('analyzePersonality', () => {
    it('should analyze personality based on birth data', async () => {
      const analysisData = {
        birthDate: '1990-04-15',
        birthLocation: 'New York, USA',
      }

      const analysis = await zodiacService.analyzePersonality(analysisData)

      expect(analysis).toHaveProperty('zodiacSign', 'Aries')
      expect(analysis).toHaveProperty('element', 'Fire')
      expect(analysis).toHaveProperty('traits')
      expect(analysis).toHaveProperty('strengths')
      expect(analysis).toHaveProperty('challenges')
      expect(analysis).toHaveProperty('compatibility')

      expect(Array.isArray(analysis.traits)).toBe(true)
      expect(Array.isArray(analysis.strengths)).toBe(true)
      expect(Array.isArray(analysis.challenges)).toBe(true)
      expect(Array.isArray(analysis.compatibility)).toBe(true)
    })

    it('should correctly determine zodiac sign from birth date', async () => {
      const testCases = [
        { date: '1990-04-15', expectedSign: 'Aries' },
        { date: '1990-05-15', expectedSign: 'Taurus' },
        { date: '1990-06-15', expectedSign: 'Gemini' },
        { date: '1990-07-15', expectedSign: 'Cancer' },
        { date: '1990-08-15', expectedSign: 'Leo' },
        { date: '1990-09-15', expectedSign: 'Virgo' },
        { date: '1990-10-15', expectedSign: 'Libra' },
        { date: '1990-11-15', expectedSign: 'Scorpio' },
        { date: '1990-12-15', expectedSign: 'Sagittarius' },
        { date: '1990-01-15', expectedSign: 'Capricorn' },
        { date: '1990-02-15', expectedSign: 'Aquarius' },
        { date: '1990-03-15', expectedSign: 'Pisces' },
      ]

      for (const testCase of testCases) {
        const analysis = await zodiacService.analyzePersonality({
          birthDate: testCase.date,
          birthLocation: 'Test Location',
        })

        expect(analysis.zodiacSign).toBe(testCase.expectedSign)
      }
    })

    it('should handle year-end crossover dates correctly', async () => {
      // Test Capricorn dates that cross year boundary
      const capricornEarly = await zodiacService.analyzePersonality({
        birthDate: '1990-12-25',
        birthLocation: 'Test',
      })
      const capricornLate = await zodiacService.analyzePersonality({
        birthDate: '1990-01-10',
        birthLocation: 'Test',
      })

      expect(capricornEarly.zodiacSign).toBe('Capricorn')
      expect(capricornLate.zodiacSign).toBe('Capricorn')
    })

    it('should include optional birth time and personality data', async () => {
      const analysisData = {
        birthDate: '1990-04-15',
        birthTime: '14:30',
        birthLocation: 'New York, USA',
        personality: 'Creative and outgoing',
      }

      const analysis = await zodiacService.analyzePersonality(analysisData)

      expect(analysis.zodiacSign).toBe('Aries')
      expect(analysis.element).toBe('Fire')
    })

    it('should return top 3 compatible signs', async () => {
      const analysis = await zodiacService.analyzePersonality({
        birthDate: '1990-04-15',
        birthLocation: 'Test Location',
      })

      expect(analysis.compatibility).toHaveLength(3)
      analysis.compatibility.forEach(compat => {
        expect(compat).toHaveProperty('sign1')
        expect(compat).toHaveProperty('sign2')
        expect(compat).toHaveProperty('percentage')
        expect(compat).toHaveProperty('description')
        expect(compat.sign1).toBe('Aries')
        expect(compat.sign2).not.toBe('Aries')
      })
    })

    it('should sort compatibility results by percentage', async () => {
      const analysis = await zodiacService.analyzePersonality({
        birthDate: '1990-04-15',
        birthLocation: 'Test Location',
      })

      const percentages = analysis.compatibility.map(c => c.percentage)
      const sortedPercentages = [...percentages].sort((a, b) => b - a)

      expect(percentages).toEqual(sortedPercentages)
    })
  })

  describe('edge cases', () => {
    it('should handle invalid birth dates gracefully', async () => {
      const analysis = await zodiacService.analyzePersonality({
        birthDate: '1990-02-30', // Invalid date
        birthLocation: 'Test Location',
      })

      expect(analysis).toHaveProperty('zodiacSign')
      expect(analysis).toHaveProperty('element')
    })

    it('should handle empty birth location', async () => {
      const analysis = await zodiacService.analyzePersonality({
        birthDate: '1990-04-15',
        birthLocation: '',
      })

      expect(analysis.zodiacSign).toBe('Aries')
    })

    it('should handle boundary dates correctly', async () => {
      // Test Aries boundaries
      const ariesStart = await zodiacService.analyzePersonality({
        birthDate: '1990-03-21',
        birthLocation: 'Test',
      })
      const ariesEnd = await zodiacService.analyzePersonality({
        birthDate: '1990-04-19',
        birthLocation: 'Test',
      })

      expect(ariesStart.zodiacSign).toBe('Aries')
      expect(ariesEnd.zodiacSign).toBe('Aries')
    })
  })
})
