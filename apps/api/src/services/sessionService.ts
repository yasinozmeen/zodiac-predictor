import { supabase } from '../utils/supabase.js'
import { APP_CONFIG } from '../config/constants.js'
import type {
  UserSessionModel,
  CreateUserSessionData,
  UpdateUserSessionData,
  UserSessionWithResponses,
  SessionProgress,
  SessionStats,
  SessionValidation,
} from '../models/UserSession.js'

export class SessionService {
  // Create new user session
  static async create(data: CreateUserSessionData): Promise<UserSessionModel> {
    const { data: result, error } = await supabase
      .from('user_sessions')
      .insert({
        session_id: data.sessionId,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        progress_data: data.progressData || {},
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create session: ${error.message}`)
    }

    return {
      id: result.id,
      sessionId: result.session_id,
      ipAddress: result.ip_address,
      userAgent: result.user_agent,
      progressData: result.progress_data,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    }
  }

  // Get session by session ID
  static async getBySessionId(sessionId: string): Promise<UserSessionModel | null> {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No session found
      }
      throw new Error(`Failed to fetch session: ${error.message}`)
    }

    return {
      id: data.id,
      sessionId: data.session_id,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      progressData: data.progress_data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  // Get session with all responses
  static async getWithResponses(sessionId: string): Promise<UserSessionWithResponses | null> {
    const { data, error } = await supabase
      .from('user_sessions')
      .select(
        `
        *,
        user_responses(
          id,
          question_id,
          selected_option_id,
          answered_at
        )
      `
      )
      .eq('session_id', sessionId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to fetch session with responses: ${error.message}`)
    }

    return {
      id: data.id,
      sessionId: data.session_id,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      progressData: data.progress_data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      responses: data.user_responses.map((response: any) => ({
        id: response.id,
        questionId: response.question_id,
        selectedOptionId: response.selected_option_id,
        answeredAt: response.answered_at,
      })),
    }
  }

  // Update session
  static async update(sessionId: string, data: UpdateUserSessionData): Promise<UserSessionModel> {
    const updateData: any = {}
    if (data.progressData) updateData.progress_data = data.progressData
    if (data.updatedAt) updateData.updated_at = data.updatedAt

    const { data: result, error } = await supabase
      .from('user_sessions')
      .update(updateData)
      .eq('session_id', sessionId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update session: ${error.message}`)
    }

    return {
      id: result.id,
      sessionId: result.session_id,
      ipAddress: result.ip_address,
      userAgent: result.user_agent,
      progressData: result.progress_data,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    }
  }

  // Update session progress
  static async updateProgress(
    sessionId: string,
    progress: Partial<SessionProgress>
  ): Promise<UserSessionModel> {
    const session = await this.getBySessionId(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const currentProgress = session.progressData as SessionProgress
    const updatedProgress = {
      ...currentProgress,
      ...progress,
      lastActivityAt: new Date().toISOString(),
    }

    return this.update(sessionId, {
      progressData: updatedProgress,
      updatedAt: new Date().toISOString(),
    })
  }

  // Get session statistics
  static async getSessionStats(sessionId: string): Promise<SessionStats> {
    const session = await this.getBySessionId(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const { data: responses, error } = await supabase
      .from('user_responses')
      .select('answered_at')
      .eq('session_id', sessionId)
      .order('answered_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch session responses: ${error.message}`)
    }

    const totalResponses = responses.length
    const completionPercentage = Math.round((totalResponses / APP_CONFIG.TOTAL_QUESTIONS) * 100)
    const isCompleted = totalResponses >= APP_CONFIG.TOTAL_QUESTIONS

    let timeSpent: number | undefined
    let completedAt: string | undefined

    if (responses.length > 0) {
      const firstResponse = new Date(responses[0].answered_at)
      const lastResponse = new Date(responses[responses.length - 1].answered_at)
      timeSpent = Math.round((lastResponse.getTime() - firstResponse.getTime()) / 1000) // in seconds

      if (isCompleted) {
        completedAt = responses[responses.length - 1].answered_at
      }
    }

    return {
      sessionId,
      totalResponses,
      completionPercentage,
      timeSpent,
      isCompleted,
      createdAt: session.createdAt,
      completedAt,
    }
  }

  // Validate session
  static async validateSession(sessionId: string): Promise<SessionValidation> {
    const session = await this.getBySessionId(sessionId)

    if (!session) {
      return {
        isValid: false,
        exists: false,
        isExpired: false,
        canContinue: false,
        message: 'Session not found',
      }
    }

    // Check if session is expired
    const createdAt = new Date(session.createdAt)
    const now = new Date()
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    const isExpired = hoursDiff > APP_CONFIG.SESSION_EXPIRY_HOURS

    // Check if session can continue (not completed and not expired)
    const stats = await this.getSessionStats(sessionId)
    const canContinue = !stats.isCompleted && !isExpired

    return {
      isValid: !isExpired,
      exists: true,
      isExpired,
      canContinue,
      message: isExpired ? 'Session has expired' : undefined,
    }
  }

  // Get all sessions (with pagination)
  static async getAll(
    page = 1,
    limit = 50
  ): Promise<{
    sessions: UserSessionModel[]
    total: number
    page: number
    limit: number
  }> {
    const offset = (page - 1) * limit

    const [{ data: sessions, error: sessionsError }, { count, error: countError }] =
      await Promise.all([
        supabase
          .from('user_sessions')
          .select('*')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1),
        supabase.from('user_sessions').select('*', { count: 'exact', head: true }),
      ])

    if (sessionsError) {
      throw new Error(`Failed to fetch sessions: ${sessionsError.message}`)
    }

    if (countError) {
      throw new Error(`Failed to count sessions: ${countError.message}`)
    }

    return {
      sessions: sessions.map((item: any) => ({
        id: item.id,
        sessionId: item.session_id,
        ipAddress: item.ip_address,
        userAgent: item.user_agent,
        progressData: item.progress_data,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      total: count || 0,
      page,
      limit,
    }
  }

  // Delete session and all associated responses
  static async delete(sessionId: string): Promise<void> {
    const { error } = await supabase.from('user_sessions').delete().eq('session_id', sessionId)

    if (error) {
      throw new Error(`Failed to delete session: ${error.message}`)
    }
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions(): Promise<number> {
    const expiryTime = new Date()
    expiryTime.setHours(expiryTime.getHours() - APP_CONFIG.SESSION_EXPIRY_HOURS)

    const { data, error } = await supabase
      .from('user_sessions')
      .delete()
      .lt('created_at', expiryTime.toISOString())
      .select('id')

    if (error) {
      throw new Error(`Failed to cleanup expired sessions: ${error.message}`)
    }

    return data.length
  }

  // Generate unique session ID
  static generateSessionId(): string {
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2, 15)
    return `${APP_CONFIG.SESSION_ID_PREFIX}${timestamp}_${randomPart}`
  }
}
