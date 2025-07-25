-- Story 1.2B: Sample Test Sessions and Responses Seed Data
-- This file creates sample sessions and responses for testing purposes

-- Clear existing test data
DELETE FROM user_responses WHERE session_id LIKE 'test-session-%';
DELETE FROM user_sessions WHERE session_id LIKE 'test-session-%';

-- Create sample test sessions
INSERT INTO user_sessions (session_id, ip_address, user_agent, progress_data, created_at, updated_at) VALUES
('test-session-001', '127.0.0.1', 'Mozilla/5.0 Test Browser', 
 '{"currentCategoryId": "cat-1", "currentQuestionIndex": 4, "totalQuestions": 16, "completedQuestions": ["q1", "q2", "q3", "q4"], "startedAt": "2025-07-25T10:00:00Z", "lastActivityAt": "2025-07-25T10:15:00Z"}', 
 NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes'),

('test-session-002', '192.168.1.100', 'Chrome Test Agent', 
 '{"currentCategoryId": "cat-2", "currentQuestionIndex": 8, "totalQuestions": 16, "completedQuestions": ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"], "startedAt": "2025-07-25T09:30:00Z", "lastActivityAt": "2025-07-25T10:00:00Z"}', 
 NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'),

('test-session-003', '10.0.0.50', 'Safari Test Browser', 
 '{"currentCategoryId": "cat-4", "currentQuestionIndex": 16, "totalQuestions": 16, "completedQuestions": ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16"], "startedAt": "2025-07-25T08:00:00Z", "lastActivityAt": "2025-07-25T08:45:00Z", "completedAt": "2025-07-25T08:45:00Z"}', 
 NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 15 minutes'),

('test-session-004', '172.16.1.25', 'Firefox Test Client', 
 '{"currentCategoryId": "cat-1", "currentQuestionIndex": 1, "totalQuestions": 16, "completedQuestions": [], "startedAt": "2025-07-25T11:00:00Z", "lastActivityAt": "2025-07-25T11:00:00Z"}', 
 NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),

('test-session-005', '203.0.113.45', 'Edge Test Browser', 
 '{"currentCategoryId": "cat-3", "currentQuestionIndex": 12, "totalQuestions": 16, "completedQuestions": ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12"], "startedAt": "2025-07-25T07:30:00Z", "lastActivityAt": "2025-07-25T08:15:00Z"}', 
 NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours 15 minutes');

-- Create sample responses for the completed session (test-session-003)
-- Note: This assumes we have actual question and option IDs from the core tables
-- We'll use placeholder logic to get real IDs from existing data

-- Insert responses for test-session-003 (completed session)
INSERT INTO user_responses (session_id, question_id, selected_option_id, answered_at)
SELECT 
    'test-session-003' as session_id,
    q.id as question_id,
    (SELECT qo.id FROM question_options qo WHERE qo.question_id = q.id ORDER BY qo.order_index LIMIT 1) as selected_option_id,
    NOW() - INTERVAL '3 hours' + (q.order_index * INTERVAL '2 minutes') as answered_at
FROM questions q
JOIN categories c ON q.category_id = c.id
ORDER BY c.order_index, q.order_index
LIMIT 16;

-- Insert partial responses for test-session-001 (in progress)
INSERT INTO user_responses (session_id, question_id, selected_option_id, answered_at)
SELECT 
    'test-session-001' as session_id,
    q.id as question_id,
    (SELECT qo.id FROM question_options qo WHERE qo.question_id = q.id ORDER BY qo.order_index LIMIT 1 OFFSET 1) as selected_option_id,
    NOW() - INTERVAL '1 hour' + (q.order_index * INTERVAL '3 minutes') as answered_at
FROM questions q
JOIN categories c ON q.category_id = c.id
ORDER BY c.order_index, q.order_index
LIMIT 4;

-- Insert partial responses for test-session-002 (in progress)
INSERT INTO user_responses (session_id, question_id, selected_option_id, answered_at)
SELECT 
    'test-session-002' as session_id,
    q.id as question_id,
    (SELECT qo.id FROM question_options qo WHERE qo.question_id = q.id ORDER BY qo.order_index DESC LIMIT 1) as selected_option_id,
    NOW() - INTERVAL '2 hours' + (q.order_index * INTERVAL '4 minutes') as answered_at
FROM questions q
JOIN categories c ON q.category_id = c.id
ORDER BY c.order_index, q.order_index
LIMIT 8;

-- Insert partial responses for test-session-005 (in progress)
INSERT INTO user_responses (session_id, question_id, selected_option_id, answered_at)
SELECT 
    'test-session-005' as session_id,
    q.id as question_id,
    (SELECT qo.id FROM question_options qo WHERE qo.question_id = q.id ORDER BY RANDOM() LIMIT 1) as selected_option_id,
    NOW() - INTERVAL '4 hours' + (q.order_index * INTERVAL '2.5 minutes') as answered_at
FROM questions q
JOIN categories c ON q.category_id = c.id
ORDER BY c.order_index, q.order_index
LIMIT 12;

-- Create a view for session statistics
CREATE OR REPLACE VIEW session_stats_view AS
SELECT 
    us.session_id,
    us.created_at,
    us.updated_at,
    us.ip_address,
    COUNT(ur.id) as total_responses,
    MIN(ur.answered_at) as first_response_at,
    MAX(ur.answered_at) as last_response_at,
    CASE 
        WHEN COUNT(ur.id) >= 16 THEN 'completed'
        WHEN COUNT(ur.id) > 0 THEN 'in_progress'
        ELSE 'not_started'
    END as session_status,
    ROUND((COUNT(ur.id)::DECIMAL / 16) * 100, 2) as completion_percentage,
    EXTRACT(EPOCH FROM (MAX(ur.answered_at) - MIN(ur.answered_at)))/60 as duration_minutes
FROM user_sessions us
LEFT JOIN user_responses ur ON us.session_id = ur.session_id
GROUP BY us.session_id, us.created_at, us.updated_at, us.ip_address
ORDER BY us.created_at DESC;

-- Add table comments
COMMENT ON TABLE user_sessions IS 'Updated with sample test sessions for development and testing';
COMMENT ON TABLE user_responses IS 'Updated with sample responses mapped to test sessions';