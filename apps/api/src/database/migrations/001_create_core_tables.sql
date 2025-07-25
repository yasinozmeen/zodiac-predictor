-- Create Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    icon_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Questions Table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Question Options Table
CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    order_index INTEGER NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_questions_category_id ON questions(category_id);
CREATE INDEX idx_questions_order_index ON questions(order_index);
CREATE INDEX idx_question_options_question_id ON question_options(question_id);
CREATE INDEX idx_question_options_order_index ON question_options(order_index);
CREATE INDEX idx_categories_order_index ON categories(order_index);

-- Insert sample categories
INSERT INTO categories (name, description, order_index, icon_name) VALUES
('Personality Traits', 'Questions about your core personality characteristics', 1, 'user-circle'),
('Life Preferences', 'Questions about your lifestyle and preferences', 2, 'heart'),
('Social Behavior', 'Questions about how you interact with others', 3, 'users'),
('Values & Beliefs', 'Questions about your core values and beliefs', 4, 'compass');