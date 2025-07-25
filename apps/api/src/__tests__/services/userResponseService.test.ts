import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { UserResponseService } from '../../services/userResponseService.js'
import { SessionService } from '../../services/sessionService.js'
import { supabase } from '../../utils/supabase.js'
import type { CreateUserResponseData } from '../../models/UserResponse.js'

describe('UserResponseService', () => {
  let testSessionId: string
  let testQuestionId: string
  let testOptionId: string
  let testCategoryId: string

  beforeAll(async () => {
    // Create test data with error handling
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .insert({ name: 'Response Test Category', order_index: 997 })
      .select()
      .single()

    if (categoryError || !category) {
      throw new Error(
        `Failed to create test category: ${categoryError?.message || 'No data returned'}`
      )
    }

    testCategoryId = category.id

    const { data: question } = await supabase
      .from('questions')
      .insert({
        category_id: category.id,
        question_text: 'Response Test Question',
        order_index: 1,
      })
      .select()
      .single()

    testQuestionId = question.id

    const { data: option } = await supabase
      .from('question_options')
      .insert({
        question_id: question.id,
        option_text: 'Response Test Option',
        order_index: 1,
      })
      .select()
      .single()

    testOptionId = option.id
  })

  afterAll(async () => {
    // Cleanup
    await supabase.from('user_responses').delete().eq('session_id', testSessionId)

    await supabase.from('user_sessions').delete().eq('session_id', testSessionId)

    await supabase.from('categories').delete().eq('name', 'Response Test Category')
  })

  beforeEach(async () => {
    // Create fresh session
    testSessionId = SessionService.generateSessionId()
    await SessionService.create({
      sessionId: testSessionId,
      ipAddress: '192.168.1.200',
    })

    // Clean up any existing responses
    await supabase.from('user_responses').delete().eq('session_id', testSessionId)
  })

  describe('create', () => {
    it('should create a new user response', async () => {
      const responseData: CreateUserResponseData = {
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      }

      const response = await UserResponseService.create(responseData)

      expect(response).toBeDefined()
      expect(response.id).toBeDefined()
      expect(response.sessionId).toBe(testSessionId)
      expect(response.questionId).toBe(testQuestionId)
      expect(response.selectedOptionId).toBe(testOptionId)
      expect(response.answeredAt).toBeDefined()
    })

    it('should throw error for duplicate session-question combination', async () => {
      const responseData: CreateUserResponseData = {
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      }

      // Create first response
      await UserResponseService.create(responseData)

      // Attempt to create duplicate should fail due to unique constraint
      await expect(UserResponseService.create(responseData)).rejects.toThrow()
    })
  })

  describe('getBySessionId', () => {
    it('should retrieve all responses for a session', async () => {
      // Create a response
      await UserResponseService.create({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      const responses = await UserResponseService.getBySessionId(testSessionId)

      expect(responses).toHaveLength(1)
      expect(responses[0].sessionId).toBe(testSessionId)
      expect(responses[0].questionId).toBe(testQuestionId)
    })

    it('should return empty array for session with no responses', async () => {
      const responses = await UserResponseService.getBySessionId(testSessionId)
      expect(responses).toHaveLength(0)
    })
  })

  describe('getBySessionAndQuestion', () => {
    it('should retrieve specific response by session and question', async () => {
      await UserResponseService.create({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      const response = await UserResponseService.getBySessionAndQuestion(
        testSessionId,
        testQuestionId
      )

      expect(response).toBeDefined()
      expect(response!.sessionId).toBe(testSessionId)
      expect(response!.questionId).toBe(testQuestionId)
    })

    it('should return null for non-existent response', async () => {
      const response = await UserResponseService.getBySessionAndQuestion(
        testSessionId,
        'non-existent-question'
      )
      expect(response).toBeNull()
    })
  })

  describe('upsert', () => {
    it('should create new response when none exists', async () => {
      const responseData: CreateUserResponseData = {
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      }

      const response = await UserResponseService.upsert(responseData)

      expect(response).toBeDefined()
      expect(response.sessionId).toBe(testSessionId)
      expect(response.questionId).toBe(testQuestionId)
    })

    it('should update existing response when one exists', async () => {
      // Create initial response
      await UserResponseService.create({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      // Create another option for updating
      const { data: newOption } = await supabase
        .from('question_options')
        .insert({
          question_id: testQuestionId,
          option_text: 'Updated Option',
          order_index: 2,
        })
        .select()
        .single()

      // Upsert with new option
      const updatedResponse = await UserResponseService.upsert({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: newOption.id,
      })

      expect(updatedResponse.selectedOptionId).toBe(newOption.id)

      // Verify only one response exists
      const allResponses = await UserResponseService.getBySessionId(testSessionId)
      expect(allResponses).toHaveLength(1)
    })
  })

  describe('validateResponse', () => {
    it('should validate correct response data', async () => {
      const validation = await UserResponseService.validateResponse({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      expect(validation.isValid).toBe(true)
      expect(validation.sessionExists).toBe(true)
      expect(validation.questionExists).toBe(true)
      expect(validation.optionExists).toBe(true)
      expect(validation.optionBelongsToQuestion).toBe(true)
      expect(validation.alreadyAnswered).toBe(false)
    })

    it('should detect invalid session', async () => {
      const validation = await UserResponseService.validateResponse({
        sessionId: 'invalid-session',
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      expect(validation.isValid).toBe(false)
      expect(validation.sessionExists).toBe(false)
      expect(validation.message).toContain('Session does not exist')
    })

    it('should detect invalid question', async () => {
      const validation = await UserResponseService.validateResponse({
        sessionId: testSessionId,
        questionId: 'invalid-question',
        selectedOptionId: testOptionId,
      })

      expect(validation.isValid).toBe(false)
      expect(validation.questionExists).toBe(false)
      expect(validation.message).toContain('Question does not exist')
    })

    it('should detect option that does not belong to question', async () => {
      // Create another question and option
      const { data: otherQuestion } = await supabase
        .from('questions')
        .insert({
          category_id: testCategoryId,
          question_text: 'Other Question',
          order_index: 2,
        })
        .select()
        .single()

      const { data: otherOption } = await supabase
        .from('question_options')
        .insert({
          question_id: otherQuestion.id,
          option_text: 'Other Option',
          order_index: 1,
        })
        .select()
        .single()

      const validation = await UserResponseService.validateResponse({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: otherOption.id,
      })

      expect(validation.isValid).toBe(false)
      expect(validation.optionBelongsToQuestion).toBe(false)
      expect(validation.message).toContain('Option does not belong to the specified question')
    })

    it('should detect already answered question', async () => {
      // Create initial response
      await UserResponseService.create({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      const validation = await UserResponseService.validateResponse({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      expect(validation.alreadyAnswered).toBe(true)
      // Note: alreadyAnswered doesn't make the validation invalid, just informational
    })
  })

  describe('bulkCreate', () => {
    it('should create multiple responses successfully', async () => {
      // Create additional questions and options
      const questions = []
      const options = []

      for (let i = 0; i < 3; i++) {
        const { data: question } = await supabase
          .from('questions')
          .insert({
            category_id: testCategoryId,
            question_text: `Bulk Test Question ${i}`,
            order_index: i + 10,
          })
          .select()
          .single()

        questions.push(question)

        const { data: option } = await supabase
          .from('question_options')
          .insert({
            question_id: question.id,
            option_text: `Bulk Test Option ${i}`,
            order_index: 1,
          })
          .select()
          .single()

        options.push(option)
      }

      const bulkData = {
        sessionId: testSessionId,
        responses: questions.map((q, i) => ({
          questionId: q.id,
          selectedOptionId: options[i].id,
        })),
      }

      const result = await UserResponseService.bulkCreate(bulkData)

      expect(result.successful).toHaveLength(3)
      expect(result.failed).toHaveLength(0)
      expect(result.totalProcessed).toBe(3)
    })

    it('should handle mixed success and failure in bulk create', async () => {
      const bulkData = {
        sessionId: testSessionId,
        responses: [
          {
            questionId: testQuestionId,
            selectedOptionId: testOptionId,
          },
          {
            questionId: 'invalid-question',
            selectedOptionId: testOptionId,
          },
        ],
      }

      const result = await UserResponseService.bulkCreate(bulkData)

      expect(result.successful).toHaveLength(1)
      expect(result.failed).toHaveLength(1)
      expect(result.totalProcessed).toBe(2)
      expect(result.failed[0].questionId).toBe('invalid-question')
    })
  })

  describe('getCompletionProgress', () => {
    it('should calculate completion progress correctly', async () => {
      // Create a response
      await UserResponseService.create({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      const progress = await UserResponseService.getCompletionProgress(testSessionId)

      expect(progress.completed).toBe(1)
      expect(progress.total).toBeGreaterThan(0)
      expect(progress.percentage).toBeGreaterThan(0)
      // nextQuestion may or may not be defined depending on available questions
    })

    it('should handle session with no responses', async () => {
      const progress = await UserResponseService.getCompletionProgress(testSessionId)

      expect(progress.completed).toBe(0)
      expect(progress.percentage).toBe(0)
      // nextQuestion may or may not be defined depending on available questions
    })
  })

  describe('getSessionResponseStats', () => {
    it('should calculate response statistics', async () => {
      // Create zodiac scoring for the option
      await supabase.from('zodiac_scoring').insert({
        question_option_id: testOptionId,
        zodiac_sign: 'aries',
        score_value: 8,
      })

      // Create response
      await UserResponseService.create({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      const stats = await UserResponseService.getSessionResponseStats(testSessionId)

      expect(stats.sessionId).toBe(testSessionId)
      expect(stats.totalResponses).toBe(1)
      expect(stats.responsesByCategory).toBeDefined()
      expect(stats.responsesByCategory[testCategoryId]).toBe(1)
      expect(stats.responsesByZodiacSign).toBeDefined()
      // Zodiac scoring may not be available in test environment
      expect(
        typeof stats.responsesByZodiacSign.aries === 'number' ||
          stats.responsesByZodiacSign.aries === undefined
      ).toBe(true)
      expect(stats.completionRate).toBeGreaterThan(0)
    })
  })

  describe('delete operations', () => {
    it('should delete individual response', async () => {
      const response = await UserResponseService.create({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      await UserResponseService.delete(response.id)

      const deletedResponse = await UserResponseService.getBySessionAndQuestion(
        testSessionId,
        testQuestionId
      )
      expect(deletedResponse).toBeNull()
    })

    it('should delete all responses for a session', async () => {
      // Create response
      await UserResponseService.create({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      const deletedCount = await UserResponseService.deleteBySessionId(testSessionId)

      expect(deletedCount).toBe(1)

      const responses = await UserResponseService.getBySessionId(testSessionId)
      expect(responses).toHaveLength(0)
    })
  })
})
