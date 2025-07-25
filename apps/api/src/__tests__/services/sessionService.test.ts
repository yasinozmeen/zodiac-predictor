import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { SessionService } from '../../services/sessionService.js'
import { supabase } from '../../utils/supabase.js'
import type { CreateUserSessionData } from '../../models/UserSession.js'

describe('SessionService', () => {
  let testSessionData: CreateUserSessionData
  beforeAll(() => {
    testSessionData = {
      sessionId: `test-session-${Date.now()}`,
      ipAddress: '127.0.0.1',
      userAgent: 'Jest Test Agent',
      progressData: {
        currentCategoryId: 'test-category',
        currentQuestionIndex: 0,
        totalQuestions: 16,
        completedQuestions: [],
        startedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      },
    }
  })

  afterAll(async () => {
    // Clean up all test sessions
    await supabase.from('user_sessions').delete().ilike('session_id', 'test-session-%')
  })

  beforeEach(async () => {
    // Clean up any existing test sessions
    await supabase.from('user_sessions').delete().eq('session_id', testSessionData.sessionId)
  })

  describe('generateSessionId', () => {
    it('should generate unique session IDs', () => {
      const id1 = SessionService.generateSessionId()
      const id2 = SessionService.generateSessionId()

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^session_[a-z0-9]+_[a-z0-9]+$/)
    })
  })

  describe('create', () => {
    it('should create a new session', async () => {
      const session = await SessionService.create(testSessionData)

      expect(session).toBeDefined()
      expect(session.id).toBeDefined()
      expect(session.sessionId).toBe(testSessionData.sessionId)
      expect(session.ipAddress).toBe(testSessionData.ipAddress)
      expect(session.userAgent).toBe(testSessionData.userAgent)
      expect(session.progressData).toEqual(testSessionData.progressData)
      expect(session.createdAt).toBeDefined()
      expect(session.updatedAt).toBeDefined()

      // Store session ID for reference if needed
    })

    it('should throw error for duplicate session ID', async () => {
      await SessionService.create(testSessionData)

      await expect(SessionService.create(testSessionData)).rejects.toThrow()
    })

    it('should create session with minimal data', async () => {
      const minimalData: CreateUserSessionData = {
        sessionId: `test-session-minimal-${Date.now()}`,
      }

      const session = await SessionService.create(minimalData)

      expect(session).toBeDefined()
      expect(session.sessionId).toBe(minimalData.sessionId)
      expect(session.ipAddress).toBeNull()
      expect(session.userAgent).toBeNull()
      expect(session.progressData).toEqual({})
    })
  })

  describe('getBySessionId', () => {
    beforeEach(async () => {
      await SessionService.create(testSessionData)
    })

    it('should retrieve existing session', async () => {
      const session = await SessionService.getBySessionId(testSessionData.sessionId)

      expect(session).toBeDefined()
      expect(session!.sessionId).toBe(testSessionData.sessionId)
      expect(session!.ipAddress).toBe(testSessionData.ipAddress)
      expect(session!.progressData).toEqual(testSessionData.progressData)
    })

    it('should return null for non-existent session', async () => {
      const session = await SessionService.getBySessionId('non-existent-session')
      expect(session).toBeNull()
    })
  })

  describe('update', () => {
    beforeEach(async () => {
      await SessionService.create(testSessionData)
    })

    it('should update session progress data', async () => {
      const newProgressData = {
        currentCategoryId: 'updated-category',
        currentQuestionIndex: 5,
        totalQuestions: 16,
        completedQuestions: ['q1', 'q2', 'q3', 'q4', 'q5'],
        startedAt: testSessionData.progressData!.startedAt,
        lastActivityAt: new Date().toISOString(),
      }

      const updatedSession = await SessionService.update(testSessionData.sessionId, {
        progressData: newProgressData,
      })

      expect(updatedSession.progressData).toEqual(newProgressData)
      expect(updatedSession.sessionId).toBe(testSessionData.sessionId)
    })

    it('should throw error for non-existent session', async () => {
      await expect(
        SessionService.update('non-existent-session', { progressData: {} })
      ).rejects.toThrow()
    })
  })

  describe('updateProgress', () => {
    beforeEach(async () => {
      await SessionService.create(testSessionData)
    })

    it('should update specific progress fields', async () => {
      const progressUpdate = {
        currentQuestionIndex: 3,
        completedQuestions: ['q1', 'q2', 'q3'],
      }

      const updatedSession = await SessionService.updateProgress(
        testSessionData.sessionId,
        progressUpdate
      )

      const progress = updatedSession.progressData as any
      expect(progress.currentQuestionIndex).toBe(3)
      expect(progress.completedQuestions).toEqual(['q1', 'q2', 'q3'])
      expect(progress.currentCategoryId).toBe('test-category') // Should retain original value
      expect(progress.lastActivityAt).toBeDefined()
    })

    it('should throw error for non-existent session', async () => {
      await expect(
        SessionService.updateProgress('non-existent-session', { currentQuestionIndex: 1 })
      ).rejects.toThrow('Session not found')
    })
  })

  describe('validateSession', () => {
    beforeEach(async () => {
      await SessionService.create(testSessionData)
    })

    it('should validate existing session', async () => {
      const validation = await SessionService.validateSession(testSessionData.sessionId)

      expect(validation.isValid).toBe(true)
      expect(validation.exists).toBe(true)
      expect(validation.isExpired).toBe(false)
      expect(validation.canContinue).toBe(true)
      expect(validation.message).toBeUndefined()
    })

    it('should return invalid for non-existent session', async () => {
      const validation = await SessionService.validateSession('non-existent-session')

      expect(validation.isValid).toBe(false)
      expect(validation.exists).toBe(false)
      expect(validation.canContinue).toBe(false)
      expect(validation.message).toBe('Session not found')
    })

    it('should detect expired session', async () => {
      // Create an old session by directly inserting with past timestamp
      const oldSessionId = `test-session-old-${Date.now()}`
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

      await supabase.from('user_sessions').insert({
        session_id: oldSessionId,
        created_at: twoDaysAgo.toISOString(),
        progress_data: {},
      })

      const validation = await SessionService.validateSession(oldSessionId)

      expect(validation.isValid).toBe(false)
      expect(validation.exists).toBe(true)
      expect(validation.isExpired).toBe(true)
      expect(validation.canContinue).toBe(false)
      expect(validation.message).toBe('Session has expired')
    })
  })

  describe('getSessionStats', () => {
    let sessionWithResponses: string

    beforeEach(async () => {
      sessionWithResponses = `test-session-stats-${Date.now()}`
      await SessionService.create({
        ...testSessionData,
        sessionId: sessionWithResponses,
      })

      // Create some test questions and responses
      const { data: category } = await supabase
        .from('categories')
        .insert({ name: 'Test Category Stats', order_index: 998 })
        .select()
        .single()

      const { data: question } = await supabase
        .from('questions')
        .insert({
          category_id: category.id,
          question_text: 'Test Question Stats',
          order_index: 1,
        })
        .select()
        .single()

      const { data: option } = await supabase
        .from('question_options')
        .insert({
          question_id: question.id,
          option_text: 'Test Option Stats',
          order_index: 1,
        })
        .select()
        .single()

      // Create test responses
      await supabase.from('user_responses').insert([
        {
          session_id: sessionWithResponses,
          question_id: question.id,
          selected_option_id: option.id,
        },
      ])
    })

    afterEach(async () => {
      // Clean up test data
      await supabase.from('user_responses').delete().eq('session_id', sessionWithResponses)

      await supabase.from('categories').delete().eq('name', 'Test Category Stats')
    })

    it('should return session statistics', async () => {
      const stats = await SessionService.getSessionStats(sessionWithResponses)

      expect(stats).toBeDefined()
      expect(stats.sessionId).toBe(sessionWithResponses)
      expect(stats.totalResponses).toBe(1)
      expect(stats.completionPercentage).toBe(Math.round((1 / 16) * 100))
      expect(stats.isCompleted).toBe(false)
      expect(stats.createdAt).toBeDefined()
      expect(stats.timeSpent).toBeDefined()
    })

    it('should throw error for non-existent session', async () => {
      await expect(SessionService.getSessionStats('non-existent-session')).rejects.toThrow(
        'Session not found'
      )
    })
  })

  describe('getAll', () => {
    beforeEach(async () => {
      // Create multiple test sessions
      const sessions = [
        { ...testSessionData, sessionId: `test-session-list-1-${Date.now()}` },
        { ...testSessionData, sessionId: `test-session-list-2-${Date.now()}` },
        { ...testSessionData, sessionId: `test-session-list-3-${Date.now()}` },
      ]

      for (const session of sessions) {
        await SessionService.create(session)
      }
    })

    it('should return paginated sessions', async () => {
      const result = await SessionService.getAll(1, 2)

      expect(result).toBeDefined()
      expect(result.sessions).toBeDefined()
      expect(result.sessions.length).toBeLessThanOrEqual(2)
      expect(result.total).toBeGreaterThanOrEqual(3)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(2)
    })

    it('should handle empty results', async () => {
      // Clean up all sessions first
      await supabase.from('user_sessions').delete().ilike('session_id', 'test-session-%')

      const result = await SessionService.getAll(1, 10)

      // Check that our test sessions are gone (filter by test pattern)
      const testSessions = result.sessions.filter(s => s.sessionId.includes('test-session-'))
      expect(testSessions).toHaveLength(0)
    })
  })

  describe('delete', () => {
    beforeEach(async () => {
      await SessionService.create(testSessionData)
    })

    it('should delete existing session', async () => {
      await expect(SessionService.delete(testSessionData.sessionId)).resolves.not.toThrow()

      // Verify deletion
      const session = await SessionService.getBySessionId(testSessionData.sessionId)
      expect(session).toBeNull()
    })

    it('should handle deletion of non-existent session', async () => {
      await expect(SessionService.delete('non-existent-session')).resolves.not.toThrow()
    })
  })

  describe('cleanupExpiredSessions', () => {
    beforeEach(async () => {
      // Create an expired session
      const expiredSessionId = `test-session-expired-${Date.now()}`
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

      await supabase.from('user_sessions').insert({
        session_id: expiredSessionId,
        created_at: twoDaysAgo.toISOString(),
        progress_data: {},
      })
    })

    it('should cleanup expired sessions', async () => {
      const deletedCount = await SessionService.cleanupExpiredSessions()

      expect(deletedCount).toBeGreaterThanOrEqual(1)
    })
  })
})
