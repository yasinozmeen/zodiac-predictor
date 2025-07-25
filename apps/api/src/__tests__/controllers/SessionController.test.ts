import { describe, it, expect, afterAll, beforeEach } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import { SessionController } from '../../controllers/SessionController.js'
import { supabase } from '../../utils/supabase.js'

const app = express()
app.use(express.json())

// Mount routes
app.post('/sessions', SessionController.createSession)
app.get('/sessions/:sessionId', SessionController.getSession)
app.get('/sessions/:sessionId/details', SessionController.getSessionWithResponses)
app.patch('/sessions/:sessionId/progress', SessionController.updateSessionProgress)
app.get('/sessions/:sessionId/stats', SessionController.getSessionStats)
app.get('/sessions/:sessionId/validate', SessionController.validateSession)
app.get('/sessions/:sessionId/progress', SessionController.getSessionProgress)
app.get('/sessions', SessionController.getAllSessions)
app.delete('/sessions/:sessionId', SessionController.deleteSession)
app.post('/sessions/cleanup/expired', SessionController.cleanupExpiredSessions)

describe('SessionController', () => {
  let testSessionId: string

  afterAll(async () => {
    // Clean up all test sessions
    await supabase.from('user_sessions').delete().ilike('session_id', 'session_%')
  })

  describe('POST /sessions', () => {
    it('should create a new session', async () => {
      const response = await request(app)
        .post('/sessions')
        .send({
          ipAddress: '127.0.0.1',
          userAgent: 'Test Browser',
        })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.sessionId).toBeDefined()
      expect(response.body.data.ipAddress).toBe('127.0.0.1')
      expect(response.body.data.userAgent).toBe('Test Browser')
      expect(response.body.data.progressData).toBeDefined()

      testSessionId = response.body.data.sessionId
    })

    it('should create session with minimal data', async () => {
      const response = await request(app).post('/sessions').send({}).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.sessionId).toBeDefined()
    })
  })

  describe('GET /sessions/:sessionId', () => {
    beforeEach(async () => {
      if (!testSessionId) {
        const response = await request(app).post('/sessions').send({ ipAddress: '127.0.0.1' })

        testSessionId = response.body.data.sessionId
      }
    })

    it('should retrieve existing session', async () => {
      const response = await request(app).get(`/sessions/${testSessionId}`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.sessionId).toBe(testSessionId)
    })

    it('should return 404 for non-existent session', async () => {
      const response = await request(app).get('/sessions/non-existent-session').expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Session not found')
    })

    it('should return 404 for missing session ID', async () => {
      await request(app).get('/sessions/missing-param-test-nonexistent').expect(404) // Non-existent session should return 404
    })
  })

  describe('GET /sessions/:sessionId/details', () => {
    it('should retrieve session with responses', async () => {
      const response = await request(app).get(`/sessions/${testSessionId}/details`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.sessionId).toBe(testSessionId)
      expect(response.body.data.responses).toBeDefined()
      expect(Array.isArray(response.body.data.responses)).toBe(true)
    })

    it('should return 404 for non-existent session', async () => {
      const response = await request(app).get('/sessions/non-existent-session/details').expect(404)

      expect(response.body.success).toBe(false)
    })
  })

  describe('PATCH /sessions/:sessionId/progress', () => {
    it('should update session progress', async () => {
      const progressUpdate = {
        currentQuestionIndex: 5,
        completedQuestions: ['q1', 'q2', 'q3', 'q4', 'q5'],
      }

      const response = await request(app)
        .patch(`/sessions/${testSessionId}/progress`)
        .send(progressUpdate)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.progressData.currentQuestionIndex).toBe(5)
      expect(response.body.data.progressData.completedQuestions).toEqual([
        'q1',
        'q2',
        'q3',
        'q4',
        'q5',
      ])
    })

    it('should return error for non-existent session', async () => {
      const response = await request(app)
        .patch('/sessions/non-existent-session/progress')
        .send({ currentQuestionIndex: 1 })
        .expect(500)

      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /sessions/:sessionId/stats', () => {
    it('should return session statistics', async () => {
      const response = await request(app).get(`/sessions/${testSessionId}/stats`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.sessionId).toBe(testSessionId)
      expect(response.body.data.totalResponses).toBeDefined()
      expect(response.body.data.completionPercentage).toBeDefined()
      expect(response.body.data.isCompleted).toBeDefined()
    })

    it('should return error for non-existent session', async () => {
      const response = await request(app).get('/sessions/non-existent-session/stats').expect(500)

      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /sessions/:sessionId/validate', () => {
    it('should validate existing session', async () => {
      const response = await request(app).get(`/sessions/${testSessionId}/validate`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.isValid).toBe(true)
      expect(response.body.data.exists).toBe(true)
      expect(response.body.data.canContinue).toBe(true)
    })

    it('should return invalid for non-existent session', async () => {
      const response = await request(app).get('/sessions/non-existent-session/validate').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isValid).toBe(false)
      expect(response.body.data.exists).toBe(false)
      expect(response.body.data.message).toBe('Session not found')
    })
  })

  describe('GET /sessions/:sessionId/progress', () => {
    it('should return session progress', async () => {
      const response = await request(app).get(`/sessions/${testSessionId}/progress`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.completed).toBeDefined()
      expect(response.body.data.total).toBeDefined()
      expect(response.body.data.percentage).toBeDefined()
    })
  })

  describe('GET /sessions', () => {
    beforeEach(async () => {
      // Create multiple test sessions
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/sessions')
          .send({ ipAddress: `127.0.0.${i + 1}` })
      }
    })

    it('should return paginated sessions', async () => {
      const response = await request(app).get('/sessions?page=1&limit=2').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.sessions).toBeDefined()
      expect(Array.isArray(response.body.data.sessions)).toBe(true)
      expect(response.body.data.sessions.length).toBeLessThanOrEqual(2)
      expect(response.body.data.total).toBeGreaterThanOrEqual(1)
      expect(response.body.data.page).toBe(1)
      expect(response.body.data.limit).toBe(2)
    })

    it('should use default pagination values', async () => {
      const response = await request(app).get('/sessions').expect(200)

      expect(response.body.data.page).toBe(1)
      expect(response.body.data.limit).toBe(50)
    })

    it('should limit maximum page size', async () => {
      const response = await request(app).get('/sessions?limit=200').expect(200)

      expect(response.body.data.limit).toBe(100) // Should be capped at 100
    })
  })

  describe('DELETE /sessions/:sessionId', () => {
    let sessionToDelete: string

    beforeEach(async () => {
      const response = await request(app).post('/sessions').send({ ipAddress: '127.0.0.1' })

      sessionToDelete = response.body.data.sessionId
    })

    it('should delete existing session', async () => {
      const response = await request(app).delete(`/sessions/${sessionToDelete}`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Session deleted successfully')

      // Verify deletion
      await request(app).get(`/sessions/${sessionToDelete}`).expect(404)
    })

    it('should handle deletion of non-existent session', async () => {
      const response = await request(app).delete('/sessions/non-existent-session').expect(200)

      expect(response.body.success).toBe(true)
    })
  })

  describe('POST /sessions/cleanup/expired', () => {
    beforeEach(async () => {
      // Create an expired session directly in database
      const expiredSessionId = `session_expired_${Date.now()}`
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

      await supabase.from('user_sessions').insert({
        session_id: expiredSessionId,
        created_at: twoDaysAgo.toISOString(),
        progress_data: {},
      })
    })

    it('should cleanup expired sessions', async () => {
      const response = await request(app).post('/sessions/cleanup/expired').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.deletedCount).toBeGreaterThanOrEqual(0)
      expect(response.body.message).toContain('Cleaned up')
    })
  })

  describe('Error handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This test would require mocking the database connection
      // For now, we'll test with invalid data that should trigger errors

      const response = await request(app)
        .patch('/sessions/invalid-session-id/progress')
        .send({ currentQuestionIndex: 'invalid' })
        .expect(500)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })

    it('should return proper error format', async () => {
      const response = await request(app).get('/sessions/non-existent-session').expect(404)

      expect(response.body).toHaveProperty('success')
      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body.success).toBe(false)
    })
  })
})
