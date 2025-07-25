-- Story 1.2B: Advanced Schema and Scoring System
-- Create Zodiac Scoring Table
CREATE TABLE zodiac_scoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_option_id UUID NOT NULL REFERENCES question_options(id) ON DELETE CASCADE,
    zodiac_sign VARCHAR(20) NOT NULL CHECK (zodiac_sign IN (
        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
        'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    )),
    score_value INTEGER NOT NULL DEFAULT 1 CHECK (score_value >= 1 AND score_value <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create User Sessions Table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    progress_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create User Responses Table
CREATE TABLE user_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id UUID NOT NULL REFERENCES question_options(id) ON DELETE CASCADE,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique constraint: one response per question per session
    UNIQUE(session_id, question_id)
);

-- Create Performance Optimization Indexes
CREATE INDEX idx_zodiac_scoring_option ON zodiac_scoring(question_option_id);
CREATE INDEX idx_zodiac_scoring_sign ON zodiac_scoring(zodiac_sign);
CREATE INDEX idx_zodiac_scoring_option_sign ON zodiac_scoring(question_option_id, zodiac_sign);

CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_created_at ON user_sessions(created_at);

CREATE INDEX idx_user_responses_session ON user_responses(session_id);
CREATE INDEX idx_user_responses_question ON user_responses(question_id);
CREATE INDEX idx_user_responses_session_question ON user_responses(session_id, question_id);
CREATE INDEX idx_user_responses_answered_at ON user_responses(answered_at);

-- Create update trigger for user_sessions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_sessions_updated_at 
    BEFORE UPDATE ON user_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add table comments for documentation
COMMENT ON TABLE zodiac_scoring IS 'Stores scoring weights for each question option and zodiac sign combination';
COMMENT ON TABLE user_sessions IS 'Tracks user sessions without authentication, using session IDs for anonymity';
COMMENT ON TABLE user_responses IS 'Stores user responses to survey questions within sessions';

COMMENT ON COLUMN zodiac_scoring.score_value IS 'Score weight (1-10) for this option-sign combination';
COMMENT ON COLUMN user_sessions.session_id IS 'Unique session identifier for tracking user progress';
COMMENT ON COLUMN user_sessions.progress_data IS 'JSON object storing session progress and metadata';
COMMENT ON COLUMN user_responses.session_id IS 'References user_sessions.session_id for session tracking';