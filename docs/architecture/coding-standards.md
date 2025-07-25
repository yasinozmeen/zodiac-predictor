# Coding Standards

## General Principles

### Code Quality

- **Readable Code:** Write code that tells a story
- **Single Responsibility:** Each function/class should have one reason to
  change
- **DRY Principle:** Don't Repeat Yourself - extract common logic
- **YAGNI:** You Ain't Gonna Need It - avoid over-engineering

### TypeScript Usage

- **Strict Mode:** Always use strict TypeScript configuration
- **Type Safety:** Prefer types over `any`
- **Interface over Type:** Use interfaces for object shapes
- **Explicit Return Types:** For public functions and methods

## File Organization

### Directory Structure

```
apps/
├── web/src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page-level components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API calls and external services
│   ├── types/            # Component-specific types
│   ├── utils/            # Pure utility functions
│   └── constants/        # Application constants
└── api/src/
    ├── controllers/      # Request handlers
    ├── routes/           # Route definitions
    ├── models/           # Database models
    ├── middleware/       # Express middleware
    ├── services/         # Business logic
    ├── types/            # API-specific types
    └── utils/            # Server utilities
```

### File Naming Conventions

- **Components:** PascalCase (`UserProfile.tsx`)
- **Files:** kebab-case (`user-service.ts`)
- **Directories:** kebab-case (`user-management/`)
- **Constants:** SCREAMING_SNAKE_CASE (`API_BASE_URL`)

## TypeScript Standards

### Type Definitions

```typescript
// ✅ Good - Explicit interface
interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

// ❌ Avoid - Implicit any
const user = getData() // any type

// ✅ Good - Generic constraints
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}
```

### Function Signatures

```typescript
// ✅ Good - Explicit return type
function calculateZodiacScore(responses: UserResponse[]): ZodiacScore {
  // implementation
}

// ✅ Good - Async function
async function fetchQuestions(categoryId: string): Promise<Question[]> {
  // implementation
}
```

### Error Handling

```typescript
// ✅ Good - Typed error handling
type ApiError = {
  code: string
  message: string
  details?: Record<string, unknown>
}

function handleApiError(error: ApiError): void {
  // error handling logic
}
```

## React Standards

### Component Structure

```typescript
// ✅ Good component structure
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  onUpdate
}) => {
  // Hooks at the top
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Event handlers
  const handleSubmit = useCallback((data: UserData) => {
    // implementation
  }, []);

  // Early returns
  if (loading) return <LoadingSpinner />;
  if (!user) return <NotFound />;

  // Main render
  return (
    <div className="user-profile">
      {/* JSX */}
    </div>
  );
};
```

### Hook Usage

```typescript
// ✅ Good - Custom hook
export const useZodiacCalculation = (responses: UserResponse[]) => {
  const [result, setResult] = useState<ZodiacResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculate = useCallback(async () => {
    // implementation
  }, [responses])

  return { result, loading, error, calculate }
}
```

### Component Naming

- **Pages:** `HomePage`, `SurveyPage`, `ResultsPage`
- **Components:** `QuestionCard`, `ProgressBar`, `ZodiacSymbol`
- **Hooks:** `useQuestions`, `useZodiacScore`, `useLocalStorage`

## Backend Standards

### Controller Pattern

```typescript
// ✅ Good - Controller structure
export class QuestionController {
  async getQuestions(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.categoryId
      const questions = await QuestionService.getByCategory(categoryId)

      res.json({
        data: questions,
        message: 'Questions retrieved successfully',
      })
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch questions',
        details: error.message,
      })
    }
  }
}
```

### Service Layer

```typescript
// ✅ Good - Service layer
export class ZodiacService {
  static async calculateZodiac(
    responses: UserResponse[]
  ): Promise<ZodiacResult> {
    // Business logic here
    const scores = await this.calculateScores(responses)
    const prediction = this.determinePrediction(scores)
    return this.formatResult(prediction)
  }

  private static calculateScores(responses: UserResponse[]): ZodiacScores {
    // Pure calculation logic
  }
}
```

### API Response Format

```typescript
// ✅ Standard API response
interface ApiResponse<T> {
  data: T
  message: string
  status: number
  timestamp: string
}

// ✅ Error response
interface ApiError {
  error: string
  details?: string
  code: string
  timestamp: string
}
```

## Database Standards

### Naming Conventions

- **Tables:** snake_case (`user_sessions`, `zodiac_scores`)
- **Columns:** snake_case (`created_at`, `question_text`)
- **Primary Keys:** `id` (UUID preferred)
- **Foreign Keys:** `table_id` (`category_id`, `user_id`)

### Query Organization

```typescript
// ✅ Good - Organized queries
export const QuestionQueries = {
  findByCategory: `
    SELECT q.*, qo.option_text, qo.order_index as option_order
    FROM questions q
    JOIN question_options qo ON q.id = qo.question_id
    WHERE q.category_id = $1
    ORDER BY q.order_index, qo.order_index
  `,

  findWithScoring: `
    SELECT q.*, qo.*, zs.zodiac_sign, zs.score_value
    FROM questions q
    JOIN question_options qo ON q.id = qo.question_id
    JOIN zodiac_scoring zs ON qo.id = zs.question_option_id
    WHERE q.category_id = $1
  `,
}
```

## Testing Standards

### Test File Structure

```typescript
// user.service.test.ts
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com' }

      // Act
      const result = await UserService.createUser(userData)

      // Assert
      expect(result).toHaveProperty('id')
      expect(result.name).toBe('John')
    })

    it('should throw error with invalid email', async () => {
      // Test error cases
    })
  })
})
```

### Component Testing

```typescript
// UserProfile.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('renders user information correctly', () => {
    render(<UserProfile userId="123" />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

## Documentation Standards

### Code Comments

```typescript
/**
 * Calculates zodiac sign prediction based on user responses
 * @param responses - Array of user responses to survey questions
 * @param weights - Optional scoring weights for different categories
 * @returns Promise resolving to zodiac prediction with confidence score
 */
async function calculateZodiacPrediction(
  responses: UserResponse[],
  weights?: CategoryWeights
): Promise<ZodiacPrediction> {
  // Implementation details...
}
```

### README Structure

- **Installation:** Clear setup instructions
- **Usage:** Basic usage examples
- **API Documentation:** Endpoint documentation
- **Contributing:** Development guidelines

## Performance Guidelines

### Frontend Performance

- **Bundle Size:** Monitor with webpack-bundle-analyzer
- **Lazy Loading:** Use React.lazy for route components
- **Memoization:** Use React.memo for expensive components
- **Image Optimization:** WebP format, appropriate sizing

### Backend Performance

- **Database Queries:** Use indexes, avoid N+1 queries
- **Caching:** Implement caching for frequently accessed data
- **Response Size:** Minimize payload size
- **Connection Pooling:** Use connection pools for database

## Security Guidelines

### Input Validation

```typescript
// ✅ Good - Input validation
const questionSchema = z.object({
  categoryId: z.string().uuid(),
  text: z.string().min(1).max(500),
  options: z.array(z.string()).min(2).max(6),
})

function createQuestion(data: unknown) {
  const validated = questionSchema.parse(data)
  // Safe to use validated data
}
```

### Environment Variables

```typescript
// ✅ Good - Environment validation
const config = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl:
    process.env.DATABASE_URL ||
    (() => {
      throw new Error('DATABASE_URL is required')
    })(),
  apiKey:
    process.env.API_KEY ||
    (() => {
      throw new Error('API_KEY is required')
    })(),
}
```

## Git Standards

### Commit Messages

```
feat: add zodiac calculation algorithm
fix: resolve question ordering bug
docs: update API documentation
style: format code according to prettier rules
refactor: extract scoring logic to service layer
test: add unit tests for question service
chore: update dependencies
```

### Branch Naming

- **Features:** `feature/user-authentication`
- **Bug Fixes:** `fix/question-validation-error`
- **Documentation:** `docs/api-endpoints`
- **Refactoring:** `refactor/extract-services`

### Pull Request Guidelines

- **Title:** Clear, descriptive title
- **Description:** What, why, and how
- **Testing:** How was it tested
- **Screenshots:** For UI changes
- **Breaking Changes:** Clearly marked
