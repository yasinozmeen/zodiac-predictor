import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { ZodiacScoringService } from '../../services/zodiacScoringService.js'
import { supabase } from '../../utils/supabase.js'
import type { CreateZodiacScoringData } from '../../models/ZodiacScoring.js'

describe('ZodiacScoringService', () => {
  let testQuestionOptionId: string
  let testScoringId: string

  beforeAll(async () => {
    // Create a test question option for testing with error handling
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .insert({ name: 'Test Category', order_index: 999 })
      .select()
      .single()

    if (categoryError || !category) {
      throw new Error(
        `Failed to create test category: ${categoryError?.message || 'No data returned'}`
      )
    }

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .insert({
        category_id: category.id,
        question_text: 'Test Question',
        order_index: 1,
      })
      .select()
      .single()

    if (questionError || !question) {
      throw new Error(
        `Failed to create test question: ${questionError?.message || 'No data returned'}`
      )
    }

    const { data: option, error: optionError } = await supabase
      .from('question_options')
      .insert({
        question_id: question.id,
        option_text: 'Test Option',
        order_index: 1,
      })
      .select()
      .single()

    if (optionError || !option) {
      throw new Error(`Failed to create test option: ${optionError?.message || 'No data returned'}`)
    }

    testQuestionOptionId = option.id
  })

  afterAll(async () => {
    // Clean up test data
    if (testQuestionOptionId) {
      await supabase.from('zodiac_scoring').delete().eq('question_option_id', testQuestionOptionId)

      await supabase.from('question_options').delete().eq('id', testQuestionOptionId)
    }

    // Clean up test categories, questions
    await supabase.from('categories').delete().eq('name', 'Test Category')
  })

  beforeEach(async () => {
    // Clean up any existing test scoring entries
    await supabase.from('zodiac_scoring').delete().eq('question_option_id', testQuestionOptionId)
  })

  describe('create', () => {
    it('should create a new zodiac scoring entry', async () => {
      const scoringData: CreateZodiacScoringData = {
        questionOptionId: testQuestionOptionId,
        zodiacSign: 'aries',
        scoreValue: 8,
      }

      const result = await ZodiacScoringService.create(scoringData)

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.questionOptionId).toBe(testQuestionOptionId)
      expect(result.zodiacSign).toBe('aries')
      expect(result.scoreValue).toBe(8)

      testScoringId = result.id
    })

    it('should throw error for invalid zodiac sign', async () => {
      const scoringData: CreateZodiacScoringData = {
        questionOptionId: testQuestionOptionId,
        zodiacSign: 'invalid_sign' as any,
        scoreValue: 5,
      }

      await expect(ZodiacScoringService.create(scoringData)).rejects.toThrow()
    })

    it('should throw error for invalid score value', async () => {
      const scoringData: CreateZodiacScoringData = {
        questionOptionId: testQuestionOptionId,
        zodiacSign: 'leo',
        scoreValue: 15, // Invalid score > 10
      }

      await expect(ZodiacScoringService.create(scoringData)).rejects.toThrow()
    })
  })

  describe('getByOptionId', () => {
    beforeEach(async () => {
      // Create test scoring entries
      const testEntries: CreateZodiacScoringData[] = [
        { questionOptionId: testQuestionOptionId, zodiacSign: 'aries', scoreValue: 8 },
        { questionOptionId: testQuestionOptionId, zodiacSign: 'leo', scoreValue: 6 },
        { questionOptionId: testQuestionOptionId, zodiacSign: 'gemini', scoreValue: 9 },
      ]

      for (const entry of testEntries) {
        await ZodiacScoringService.create(entry)
      }
    })

    it('should return scoring entries for a question option', async () => {
      const results = await ZodiacScoringService.getByOptionId(testQuestionOptionId)

      expect(results).toHaveLength(3)
      expect(results[0].scoreValue).toBeGreaterThanOrEqual(results[1].scoreValue) // Should be sorted by score desc
      expect(results.every(r => r.questionOptionId === testQuestionOptionId)).toBe(true)
    })

    it('should return empty array for non-existent option', async () => {
      const results = await ZodiacScoringService.getByOptionId('non-existent-id')
      expect(results).toHaveLength(0)
    })
  })

  describe('getByZodiacSign', () => {
    beforeEach(async () => {
      await ZodiacScoringService.create({
        questionOptionId: testQuestionOptionId,
        zodiacSign: 'scorpio',
        scoreValue: 7,
      })
    })

    it('should return scoring entries for a zodiac sign', async () => {
      const results = await ZodiacScoringService.getByZodiacSign('scorpio')

      expect(results.length).toBeGreaterThan(0)
      expect(results.every(r => r.zodiacSign === 'scorpio')).toBe(true)
    })

    it('should return empty array for sign with no entries', async () => {
      const results = await ZodiacScoringService.getByZodiacSign('aquarius')
      expect(results).toHaveLength(0)
    })
  })

  describe('bulkCreate', () => {
    it('should create multiple scoring entries', async () => {
      const bulkData: CreateZodiacScoringData[] = [
        { questionOptionId: testQuestionOptionId, zodiacSign: 'taurus', scoreValue: 5 },
        { questionOptionId: testQuestionOptionId, zodiacSign: 'cancer', scoreValue: 7 },
        { questionOptionId: testQuestionOptionId, zodiacSign: 'virgo', scoreValue: 6 },
      ]

      const results = await ZodiacScoringService.bulkCreate(bulkData)

      expect(results).toHaveLength(3)
      expect(results.every(r => r.questionOptionId === testQuestionOptionId)).toBe(true)

      const signs = results.map(r => r.zodiacSign)
      expect(signs).toContain('taurus')
      expect(signs).toContain('cancer')
      expect(signs).toContain('virgo')
    })
  })

  describe('getScoringStats', () => {
    beforeEach(async () => {
      // Create varied scoring data
      const testData: CreateZodiacScoringData[] = [
        { questionOptionId: testQuestionOptionId, zodiacSign: 'pisces', scoreValue: 8 },
        { questionOptionId: testQuestionOptionId, zodiacSign: 'pisces', scoreValue: 6 },
        { questionOptionId: testQuestionOptionId, zodiacSign: 'capricorn', scoreValue: 9 },
      ]

      for (const entry of testData) {
        await ZodiacScoringService.create(entry)
      }
    })

    it('should return scoring statistics', async () => {
      const stats = await ZodiacScoringService.getScoringStats()

      expect(stats).toBeDefined()
      expect(stats.totalEntries).toBeGreaterThan(0)
      expect(stats.signDistribution).toBeDefined()
      expect(stats.averageScorePerSign).toBeDefined()

      expect(stats.signDistribution.pisces).toBe(2)
      expect(stats.signDistribution.capricorn).toBe(1)
      expect(stats.averageScorePerSign.pisces).toBe(7) // (8 + 6) / 2
      expect(stats.averageScorePerSign.capricorn).toBe(9)
    })
  })

  describe('update', () => {
    beforeEach(async () => {
      const scoring = await ZodiacScoringService.create({
        questionOptionId: testQuestionOptionId,
        zodiacSign: 'libra',
        scoreValue: 5,
      })
      testScoringId = scoring.id
    })

    it('should update a scoring entry', async () => {
      const updated = await ZodiacScoringService.update(testScoringId, {
        scoreValue: 9,
      })

      expect(updated.scoreValue).toBe(9)
      expect(updated.zodiacSign).toBe('libra') // Should remain unchanged
    })

    it('should throw error for non-existent entry', async () => {
      await expect(
        ZodiacScoringService.update('non-existent-id', { scoreValue: 5 })
      ).rejects.toThrow()
    })
  })

  describe('delete', () => {
    beforeEach(async () => {
      const scoring = await ZodiacScoringService.create({
        questionOptionId: testQuestionOptionId,
        zodiacSign: 'sagittarius',
        scoreValue: 4,
      })
      testScoringId = scoring.id
    })

    it('should delete a scoring entry', async () => {
      await expect(ZodiacScoringService.delete(testScoringId)).resolves.not.toThrow()

      // Verify deletion
      const results = await ZodiacScoringService.getByZodiacSign('sagittarius')
      expect(results.find(r => r.id === testScoringId)).toBeUndefined()
    })

    it('should handle deletion of non-existent entry', async () => {
      await expect(ZodiacScoringService.delete('non-existent-id')).resolves.not.toThrow()
    })
  })
})
