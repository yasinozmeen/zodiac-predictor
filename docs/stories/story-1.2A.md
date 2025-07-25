# Story 1.2A: Basic Database Tables and Supabase Integration

**Status:** Draft  
**Epic:** Epic 1 - Foundation & Core Infrastructure  
**Sprint:** Sprint 1  
**Created:** 2025-07-25  
**Prepared by:** Bob (Scrum Master)

## Story

**As a** developer,  
**I want** basic database tables with Supabase integration,  
**so that** I can start building the core survey functionality.

## Acceptance Criteria

1. Supabase projesi oluşturulmuş ve connection kurulmuş
2. Categories tablosu (id, name, description, order_index)
3. Questions tablosu (id, category_id, question_text, order_index)
4. Question_options tablosu (id, question_id, option_text, order_index)
5. Basit CRUD operasyonları test edilmiş
6. Connection pooling ve error handling kurulmuş

## Tasks / Subtasks

- [ ] **Task 1: Supabase Project Setup** (AC: 1)
  - [ ] Create new Supabase project
  - [ ] Configure database connection settings
  - [ ] Set up environment variables in both API and web apps
  - [ ] Install and configure Supabase client libraries

- [ ] **Task 2: Create Core Database Tables** (AC: 2, 3, 4)
  - [ ] Create categories table with UUID primary key
  - [ ] Create questions table with foreign key to categories
  - [ ] Create question_options table with foreign key to questions
  - [ ] Implement proper indexes for performance

- [ ] **Task 3: Database Models and Services** (AC: 5)
  - [ ] Create TypeScript models for Categories, Questions, QuestionOptions
  - [ ] Implement CategoryService with CRUD operations
  - [ ] Implement QuestionService with CRUD operations
  - [ ] Implement QuestionOptionService with CRUD operations

- [ ] **Task 4: API Endpoints** (AC: 5)
  - [ ] Create /api/v1/categories endpoints (GET)
  - [ ] Create /api/v1/questions endpoints (GET)
  - [ ] Create /api/v1/questions/:id/options endpoints (GET)
  - [ ] Implement proper error handling and validation

- [ ] **Task 5: Connection Management and Error Handling** (AC: 6)
  - [ ] Configure Supabase connection pooling
  - [ ] Implement database error handling middleware
  - [ ] Add connection health checks to /health endpoint
  - [ ] Create database utilities and helpers

- [ ] **Task 6: Testing and Validation** (AC: 5)
  - [ ] Write unit tests for database services
  - [ ] Write integration tests for API endpoints
  - [ ] Test database connection and CRUD operations
  - [ ] Validate data integrity and constraints

## Dev Notes

### Previous Story Insights

- **From Story 1.1:** Project structure is set up with Express backend, React
  frontend, and shared types package. API structure follows MVC pattern with
  controllers, services, routes, and middleware. Environment variables templates
  are ready but need actual Supabase configuration.

### Database Schema Details

[Source: docs/shards/database-schema.md#core-tables]

**Categories Table:**

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    icon_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Questions Table:**

```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id),
    question_text TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Question Options Table:**

```sql
CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id),
    option_text TEXT NOT NULL,
    order_index INTEGER NOT NULL
);
```

### Technology Stack Details

[Source: docs/architecture/tech-stack.md#database]

- **Database:** Supabase (hosted PostgreSQL with real-time features)
- **Client Library:** Supabase Client for database operations
- **Connection:** TLS/SSL encrypted connections
- **Architecture:** REST API with connection pooling

### File Locations

[Source: docs/architecture/source-tree.md#backend-application]

**Backend Files to Create/Modify:**

- `apps/api/src/models/` - Category.ts, Question.ts, QuestionOption.ts
- `apps/api/src/services/` - categoryService.ts, questionService.ts
- `apps/api/src/controllers/` - CategoryController.ts, QuestionController.ts
- `apps/api/src/routes/` - categories.ts, questions.ts
- `apps/api/src/utils/` - supabase.ts (database connection)
- `apps/api/.env` - Supabase connection credentials

**Environment Variables Required:**

- `SUPABASE_URL` - Project URL
- `SUPABASE_ANON_KEY` - Anonymous API key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for backend operations

### Shared Types to Update

[Source: docs/architecture/source-tree.md#shared-package]

- `packages/shared/src/types/survey.ts` - Question, QuestionOption, Category
  interfaces
- `packages/shared/src/types/api.ts` - API response interfaces

### API Design Patterns

[Source: docs/architecture/tech-stack.md#api-design]

- **API Versioning:** Use `/api/v1/` prefix structure
- **Response Format:** Standardized JSON responses with data, message, status
- **Error Handling:** Consistent error response format

### Security and Performance

[Source: docs/architecture/tech-stack.md#security-measures,
docs/shards/database-schema.md#performance-considerations]

- **Connection Pooling:** Efficient database connections within Supabase free
  tier limits
- **Parameterized Queries:** Prevent SQL injection using Supabase client methods
- **Row Level Security:** Configure RLS policies if needed
- **Indexes:** Optimize frequent queries with proper indexing

### Testing Standards

[Source: docs/architecture/coding-standards.md#testing-standards]

**Test File Locations:**

- `apps/api/src/__tests__/services/` - Service layer tests
- `apps/api/src/__tests__/controllers/` - Controller tests
- `apps/api/src/__tests__/routes/` - Route integration tests

**Testing Frameworks:**

- **Unit Tests:** Jest for business logic and services
- **API Tests:** Supertest for endpoint testing
- **Database Tests:** Use test database instance

**Test Patterns:**

- Arrange-Act-Assert pattern
- Descriptive test names
- Mock external dependencies
- Test both success and error scenarios

## Change Log

| Date       | Version | Description                                                 | Author             |
| ---------- | ------- | ----------------------------------------------------------- | ------------------ |
| 2025-07-25 | 1.0     | Initial story creation with comprehensive technical details | Bob (Scrum Master) |

## Dev Agent Record

### Agent Model Used

[To be filled by Dev Agent]

### Debug Log References

[To be filled by Dev Agent]

### Completion Notes List

[To be filled by Dev Agent]

### File List

[To be filled by Dev Agent]

## QA Results

[To be filled by QA Agent]
