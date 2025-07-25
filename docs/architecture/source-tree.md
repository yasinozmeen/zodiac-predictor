# Source Tree Structure

## Project Overview

Zodiac Predictor is organized as a monorepo using Yarn workspaces, with separate
applications for frontend and backend, plus shared packages for common
functionality.

## Root Level Structure

```
zodiac-predictor/
├── .bmad-core/              # BMad framework configuration
├── .claude/                 # Claude Code integration
├── apps/                    # Applications
│   ├── web/                # React frontend application
│   └── api/                # Express backend application
├── packages/               # Shared packages
│   └── shared/             # Common types and utilities
├── docs/                   # Project documentation
├── .yarn/                  # Yarn 2+ configuration
├── package.json            # Root workspace configuration
├── yarn.lock               # Dependency lock file
└── README.md               # Project overview
```

## Frontend Application (`apps/web/`)

### Directory Structure

```
apps/web/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Generic components (Button, Input, etc.)
│   │   ├── survey/         # Survey-specific components
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── CategoryTransition.tsx
│   │   └── results/        # Results page components
│   │       ├── ZodiacReveal.tsx
│   │       ├── CharacteristicsDisplay.tsx
│   │       └── SocialSharing.tsx
│   ├── pages/              # Page-level components
│   │   ├── HomePage.tsx
│   │   ├── SurveyPage.tsx
│   │   ├── ResultsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useQuestions.ts
│   │   ├── useZodiacCalculation.ts
│   │   ├── useLocalStorage.ts
│   │   └── useProgressTracking.ts
│   ├── services/           # API communication
│   │   ├── api.ts          # Base API client
│   │   ├── questionService.ts
│   │   ├── zodiacService.ts
│   │   └── sessionService.ts
│   ├── types/              # Frontend-specific types
│   │   ├── survey.ts
│   │   ├── zodiac.ts
│   │   └── api.ts
│   ├── utils/              # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── styles/             # Global styles
│   │   ├── globals.css
│   │   └── components.css
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── vite-env.d.ts       # Vite type definitions
├── index.html              # HTML template
├── package.json            # Frontend dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── .eslintrc.js            # ESLint configuration
```

### Key Frontend Files

#### `src/App.tsx` - Main Application

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SurveyPage } from './pages/SurveyPage';
import { ResultsPage } from './pages/ResultsPage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
};
```

#### `src/services/api.ts` - API Client

```typescript
import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## Backend Application (`apps/api/`)

### Directory Structure

```
apps/api/
├── src/                    # Source code
│   ├── controllers/        # Request handlers
│   │   ├── questionController.ts
│   │   ├── zodiacController.ts
│   │   ├── sessionController.ts
│   │   └── healthController.ts
│   ├── routes/             # Route definitions
│   │   ├── index.ts        # Main router
│   │   ├── questions.ts
│   │   ├── zodiac.ts
│   │   ├── sessions.ts
│   │   └── health.ts
│   ├── models/             # Database models
│   │   ├── Question.ts
│   │   ├── Category.ts
│   │   ├── UserSession.ts
│   │   └── ZodiacScore.ts
│   ├── services/           # Business logic
│   │   ├── questionService.ts
│   │   ├── zodiacService.ts
│   │   ├── sessionService.ts
│   │   └── databaseService.ts
│   ├── middleware/         # Express middleware
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   ├── types/              # Backend-specific types
│   │   ├── database.ts
│   │   ├── requests.ts
│   │   └── responses.ts
│   ├── utils/              # Server utilities
│   │   ├── logger.ts
│   │   ├── database.ts
│   │   └── config.ts
│   ├── database/           # Database related files
│   │   ├── migrations/     # Database migrations
│   │   ├── seeds/          # Seed data
│   │   └── connection.ts   # Database connection
│   ├── app.ts              # Express app configuration
│   └── server.ts           # Server entry point
├── package.json            # Backend dependencies
├── tsconfig.json           # TypeScript configuration
├── nodemon.json            # Nodemon configuration
└── .eslintrc.js            # ESLint configuration
```

### Key Backend Files

#### `src/app.ts` - Express Application

```typescript
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { routes } from './routes'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())
app.use(rateLimiter)

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/v1', routes)

// Error handling
app.use(errorHandler)

export { app }
```

#### `src/server.ts` - Server Entry Point

```typescript
import { app } from './app'
import { config } from './utils/config'
import { logger } from './utils/logger'

const PORT = config.port || 3001

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
```

## Shared Package (`packages/shared/`)

### Directory Structure

```
packages/shared/
├── src/                    # Source code
│   ├── types/              # Shared TypeScript types
│   │   ├── index.ts        # Re-exports
│   │   ├── survey.ts       # Survey-related types
│   │   ├── zodiac.ts       # Zodiac-related types
│   │   └── api.ts          # API interface types
│   ├── constants/          # Shared constants
│   │   ├── index.ts        # Re-exports
│   │   ├── zodiacSigns.ts  # Zodiac sign definitions
│   │   └── categories.ts   # Question categories
│   ├── utils/              # Shared utilities
│   │   ├── index.ts        # Re-exports
│   │   ├── formatters.ts   # Data formatting functions
│   │   └── validators.ts   # Validation functions
│   └── index.ts            # Main entry point
├── dist/                   # Compiled output
├── package.json            # Package configuration
└── tsconfig.json           # TypeScript configuration
```

### Key Shared Types

#### `src/types/survey.ts`

```typescript
export interface Question {
  id: string
  categoryId: string
  questionText: string
  orderIndex: number
  options: QuestionOption[]
}

export interface QuestionOption {
  id: string
  questionId: string
  optionText: string
  orderIndex: number
}

export interface UserResponse {
  questionId: string
  selectedOptionId: string
  answeredAt: Date
}
```

#### `src/types/zodiac.ts`

```typescript
export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces'

export interface ZodiacResult {
  predictedSign: ZodiacSign
  confidence: number
  scores: Record<ZodiacSign, number>
  explanation: string
  characteristics: string[]
}
```

## Documentation (`docs/`)

### Structure

```
docs/
├── prd.md                  # Product Requirements Document
├── project-brief.md        # Initial project brief
├── front-end-spec.md       # Frontend specifications
├── fullstack-architecture.md  # System architecture
├── SHARDING_INDEX.md       # Document organization index
├── stories/                # User stories
│   └── story-1.1.md       # Completed stories
├── shards/                 # Document fragments
│   ├── epic1-foundation.md
│   ├── epic4-algorithm.md
│   ├── architecture-overview.md
│   ├── database-schema.md
│   ├── deployment-guide.md
│   └── ui-components-spec.md
└── architecture/           # Technical documentation
    ├── tech-stack.md       # Technology choices
    ├── coding-standards.md # Development guidelines
    └── source-tree.md      # This file
```

## Development Workflow

### Package Scripts (Root Level)

```json
{
  "scripts": {
    "dev": "concurrently \"yarn workspace @zodiac/api dev\" \"yarn workspace @zodiac/web dev\"",
    "build": "yarn workspaces foreach run build",
    "test": "yarn workspaces foreach run test",
    "lint": "yarn workspaces foreach run lint",
    "format": "prettier --write .",
    "clean": "yarn workspaces foreach run clean"
  }
}
```

### Workspace Dependencies

- **Frontend** depends on **Shared** package
- **Backend** depends on **Shared** package
- **Shared** has no internal dependencies
- All workspaces share dev dependencies when possible

## Build Process

### Development

1. **Start Development:** `yarn dev` runs both frontend and backend
2. **Hot Reload:** Changes trigger automatic rebuilds
3. **Type Checking:** TypeScript compilation happens in real-time

### Production

1. **Build Shared:** `yarn workspace @zodiac/shared build`
2. **Build API:** `yarn workspace @zodiac/api build`
3. **Build Web:** `yarn workspace @zodiac/web build`
4. **Deploy:** Built artifacts ready for deployment

## Import/Export Patterns

### Importing Shared Types

```typescript
// In frontend or backend
import { Question, ZodiacResult, ZODIAC_SIGNS } from '@zodiac/shared'
```

### Internal Imports

```typescript
// Frontend
import { QuestionCard } from '@/components/survey/QuestionCard'
import { useQuestions } from '@/hooks/useQuestions'

// Backend
import { QuestionService } from '@/services/questionService'
import { questionRoutes } from '@/routes/questions'
```

## File Naming Conventions

### Components

- **React Components:** PascalCase (`.tsx`)
- **Hooks:** camelCase starting with `use` (`.ts`)
- **Services:** camelCase ending with `Service` (`.ts`)
- **Types:** camelCase (`.ts`)

### Backend

- **Controllers:** camelCase ending with `Controller` (`.ts`)
- **Routes:** camelCase (`.ts`)
- **Models:** PascalCase (`.ts`)
- **Services:** camelCase ending with `Service` (`.ts`)

### Documentation

- **Markdown Files:** kebab-case (`.md`)
- **Config Files:** kebab-case or camelCase based on tool requirements

This source tree structure supports scalable development while maintaining clear
separation of concerns and enabling efficient code sharing across the
application.
