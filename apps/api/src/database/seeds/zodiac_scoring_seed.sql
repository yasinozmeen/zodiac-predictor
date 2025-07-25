-- Story 1.2B: Zodiac Scoring Seed Data
-- This file contains the mapping between question options and zodiac signs with weighted scores

-- Disable foreign key checks temporarily for seeding
SET session_replication_role = replica;

-- Clear existing zodiac scoring data (for re-seeding)
DELETE FROM zodiac_scoring;

-- Note: This is a comprehensive scoring matrix that maps each question option to zodiac signs
-- Scores range from 1-10, where higher scores indicate stronger alignment
-- Each option can contribute to multiple zodiac signs with different weights

-- Personality Traits Category Scoring
-- Question: "How do you typically approach new challenges?"
INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'aries', 9 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%head first%' OR qo.option_text ILIKE '%immediate%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'leo', 8 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%confident%' OR qo.option_text ILIKE '%lead%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'virgo', 9 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%plan%' OR qo.option_text ILIKE '%analyze%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'libra', 8 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%balance%' OR qo.option_text ILIKE '%consider%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'scorpio', 9 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%deep%' OR qo.option_text ILIKE '%intense%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'sagittarius', 8 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%explore%' OR qo.option_text ILIKE '%adventure%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'capricorn', 9 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%step by step%' OR qo.option_text ILIKE '%methodical%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'aquarius', 8 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%innovative%' OR qo.option_text ILIKE '%unique%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'pisces', 7 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%intuitive%' OR qo.option_text ILIKE '%feel%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'taurus', 8 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%steady%' OR qo.option_text ILIKE '%stable%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'gemini', 8 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%multiple%' OR qo.option_text ILIKE '%variety%';

INSERT INTO zodiac_scoring (question_option_id, zodiac_sign, score_value) 
SELECT qo.id, 'cancer', 8 FROM question_options qo 
JOIN questions q ON qo.question_id = q.id 
JOIN categories c ON q.category_id = c.id 
WHERE c.name = 'Personality Traits' AND qo.option_text ILIKE '%careful%' OR qo.option_text ILIKE '%protect%';

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Add comments for maintenance
COMMENT ON TABLE zodiac_scoring IS 'Updated with comprehensive scoring matrix for personality-based zodiac prediction';

-- Create a view for easier scoring queries
CREATE OR REPLACE VIEW zodiac_scoring_summary AS
SELECT 
    zs.zodiac_sign,
    COUNT(*) as total_options_mapped,
    AVG(zs.score_value) as average_score,
    MIN(zs.score_value) as min_score,
    MAX(zs.score_value) as max_score
FROM zodiac_scoring zs
GROUP BY zs.zodiac_sign
ORDER BY zs.zodiac_sign;