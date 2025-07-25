-- Story 1.2B: Rollback Advanced Schema and Scoring System
-- Drop triggers and functions first
DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON user_sessions;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_user_responses_answered_at;
DROP INDEX IF EXISTS idx_user_responses_session_question;
DROP INDEX IF EXISTS idx_user_responses_question;
DROP INDEX IF EXISTS idx_user_responses_session;

DROP INDEX IF EXISTS idx_user_sessions_created_at;
DROP INDEX IF EXISTS idx_user_sessions_session_id;

DROP INDEX IF EXISTS idx_zodiac_scoring_option_sign;
DROP INDEX IF EXISTS idx_zodiac_scoring_sign;
DROP INDEX IF EXISTS idx_zodiac_scoring_option;

-- Drop tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS user_responses;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS zodiac_scoring;