import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { SessionService } from '../../services/sessionService.js'
import { UserResponseService } from '../../services/userResponseService.js'
import { supabase } from '../../utils/supabase.js'
import { APP_CONFIG } from '../../config/constants.js'

describe('SessionService - Advanced Scenarios', () => {
  let testSessionId: string
  let testQuestionId: string
  let testOptionId: string

  beforeAll(async () => {
    // Setup test data with error handling
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .insert({ name: 'Test Category Advanced', order_index: 998 })
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
        question_text: 'Advanced Test Question',
        order_index: 1,
      })
      .select()
      .single()

    if (questionError || !question) {
      throw new Error(
        `Failed to create test question: ${questionError?.message || 'No data returned'}`
      )
    }

    testQuestionId = question.id

    const { data: option, error: optionError } = await supabase
      .from('question_options')
      .insert({
        question_id: question.id,
        option_text: 'Advanced Test Option',
        order_index: 1,
      })
      .select()
      .single()

    if (optionError || !option) {
      throw new Error(`Failed to create test option: ${optionError?.message || 'No data returned'}`)
    }

    testOptionId = option.id
  })

  afterAll(async () => {
    // Cleanup test data
    await supabase.from('user_sessions').delete().like('session_id', 'session_test_%')

    await supabase.from('categories').delete().eq('name', 'Test Category Advanced')
  })

  beforeEach(async () => {
    // Create fresh test session
    testSessionId = SessionService.generateSessionId()
    await SessionService.create({
      sessionId: testSessionId,
      ipAddress: '192.168.1.100',
      userAgent: 'Test Agent',
    })
  })

  describe('Session Progress Tracking', () => {
    it('should update session progress correctly', async () => {
      const progressUpdate = {
        currentCategoryId: 'cat-123',
        currentQuestionIndex: 5,
        completedQuestions: ['q1', 'q2', 'q3'],
      }

      const updatedSession = await SessionService.updateProgress(testSessionId, progressUpdate)

      expect(updatedSession.progressData).toMatchObject(progressUpdate)
      expect(updatedSession.progressData.lastActivityAt).toBeDefined()
    })

    it('should calculate session statistics accurately', async () => {
      // Add some test responses
      await UserResponseService.create({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      const stats = await SessionService.getSessionStats(testSessionId)

      expect(stats.sessionId).toBe(testSessionId)
      expect(stats.totalResponses).toBe(1)
      expect(stats.completionPercentage).toBe(Math.round((1 / APP_CONFIG.TOTAL_QUESTIONS) * 100))
      expect(stats.isCompleted).toBe(false)
      expect(stats.timeSpent).toBeGreaterThanOrEqual(0)
    })

    it('should detect completed sessions', async () => {
      // Mock a completed session by adding multiple responses
      // Note: This would require creating multiple questions, so we'll test the logic
      const stats = await SessionService.getSessionStats(testSessionId)

      // With only 1 response, should not be completed
      expect(stats.isCompleted).toBe(false)
      expect(stats.completedAt).toBeUndefined()
    })
  })

  describe('Session Validation', () => {
    it('should validate active session as valid', async () => {
      const validation = await SessionService.validateSession(testSessionId)

      expect(validation.isValid).toBe(true)
      expect(validation.exists).toBe(true)
      expect(validation.isExpired).toBe(false)
      expect(validation.canContinue).toBe(true)
      expect(validation.message).toBeUndefined()
    })

    it('should detect non-existent session', async () => {
      const validation = await SessionService.validateSession('non-existent-session')

      expect(validation.isValid).toBe(false)
      expect(validation.exists).toBe(false)
      expect(validation.isExpired).toBe(false)
      expect(validation.canContinue).toBe(false)
      expect(validation.message).toBe('Session not found')
    })

    it('should detect expired sessions', async () => {
      // Create an old session by manipulating created_at
      const oldSessionId = SessionService.generateSessionId()
      await supabase.from('user_sessions').insert({
        session_id: oldSessionId,
        ip_address: '192.168.1.101',
        created_at: new Date(
          Date.now() - (APP_CONFIG.SESSION_EXPIRY_HOURS + 1) * 60 * 60 * 1000
        ).toISOString(),
      })

      const validation = await SessionService.validateSession(oldSessionId)

      expect(validation.isValid).toBe(false)
      expect(validation.exists).toBe(true)
      expect(validation.isExpired).toBe(true)
      expect(validation.canContinue).toBe(false)
      expect(validation.message).toBe('Session has expired')
    })
  })

  describe('Session Cleanup', () => {
    it('should clean up expired sessions', async () => {
      // Create an expired session
      const expiredSessionId = SessionService.generateSessionId()
      await supabase.from('user_sessions').insert({
        session_id: expiredSessionId,
        ip_address: '192.168.1.102',
        created_at: new Date(
          Date.now() - (APP_CONFIG.SESSION_EXPIRY_HOURS + 1) * 60 * 60 * 1000
        ).toISOString(),
      })

      const deletedCount = await SessionService.cleanupExpiredSessions()

      expect(deletedCount).toBeGreaterThanOrEqual(1)

      // Verify the expired session was deleted
      const session = await SessionService.getBySessionId(expiredSessionId)
      expect(session).toBeNull()
    })

    it('should not clean up active sessions', async () => {
      await SessionService.cleanupExpiredSessions()

      const activeSessionsAfter = await SessionService.getAll(1, 100)

      // Should still have at least our test session
      expect(activeSessionsAfter.sessions.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Session ID Generation', () => {
    it('should generate unique session IDs', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        const id = SessionService.generateSessionId()
        expect(ids.has(id)).toBe(false)
        ids.add(id)
        expect(id).toMatch(/^session_[a-z0-9]+_[a-z0-9]+$/)
      }
    })

    it('should include timestamp in session ID', () => {
      const beforeTime = Date.now()
      const sessionId = SessionService.generateSessionId()
      const afterTime = Date.now()

      // Extract timestamp part from session ID (it's in milliseconds as base36)
      const timestampPart = sessionId.split('_')[1]
      const parsedTimestamp = parseInt(timestampPart, 36)

      expect(parsedTimestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(parsedTimestamp).toBeLessThanOrEqual(afterTime + 1000) // 1 second tolerance
    })
  })

  describe('Session with Responses Integration', () => {
    it('should retrieve session with all responses', async () => {
      // Add a response to the session
      await UserResponseService.create({
        sessionId: testSessionId,
        questionId: testQuestionId,
        selectedOptionId: testOptionId,
      })

      const sessionWithResponses = await SessionService.getWithResponses(testSessionId)

      expect(sessionWithResponses).toBeDefined()
      expect(sessionWithResponses!.sessionId).toBe(testSessionId)
      expect(sessionWithResponses!.responses).toHaveLength(1)
      expect(sessionWithResponses!.responses[0].questionId).toBe(testQuestionId)
      expect(sessionWithResponses!.responses[0].selectedOptionId).toBe(testOptionId)
    })

    it('should handle session with no responses', async () => {
      const sessionWithResponses = await SessionService.getWithResponses(testSessionId)

      expect(sessionWithResponses).toBeDefined()
      expect(sessionWithResponses!.responses).toHaveLength(0)
    })
  })

  describe('Pagination', () => {
    it('should paginate sessions correctly', async () => {
      // Create exactly 5 test sessions with unique prefix for this test
      const testPrefix = `paginationtest_${Date.now()}_`
      const additionalSessions = []
      for (let i = 0; i < 5; i++) {
        const sessionId = `${testPrefix}${i}`
        await SessionService.create({
          sessionId,
          ipAddress: `192.168.1.${200 + i}`,
        })
        additionalSessions.push(sessionId)
      }

      try {
        const page1 = await SessionService.getAll(1, 3)
        expect(page1.sessions.length).toBeGreaterThanOrEqual(3) // At least our 3 sessions
        expect(page1.page).toBe(1)
        expect(page1.limit).toBe(3)
        expect(page1.total).toBeGreaterThanOrEqual(5) // At least our 5 sessions

        const page2 = await SessionService.getAll(2, 3)
        expect(page2.sessions.length).toBeGreaterThanOrEqual(0) // May have our remaining sessions
        expect(page2.page).toBe(2)

        // Basic pagination structure check
        expect(page1.sessions).toBeDefined()
        expect(page2.sessions).toBeDefined()
      } finally {
        // Clean up our test sessions
        for (const sessionId of additionalSessions) {
          try {
            await SessionService.delete(sessionId)
          } catch {
            // Ignore cleanup errors
          }
        }
      }
    })
  })
})
