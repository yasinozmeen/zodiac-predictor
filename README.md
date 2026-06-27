# ✨ Zodiac Predictor

[![CI/CD Pipeline](https://github.com/USER/zodiac-predictor/actions/workflows/ci.yml/badge.svg)](https://github.com/USER/zodiac-predictor/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Yarn](https://img.shields.io/badge/Yarn-4.0-2C8EBB.svg)](https://yarnpkg.com/)

AI-powered zodiac compatibility and personality prediction application built
with React, Node.js, and TypeScript.

## 🚀 Features

- **Personality Analysis**: Get detailed insights based on your birth
  information
- **Zodiac Compatibility**: Discover compatibility with different zodiac signs
- **Interactive Survey**: Multi-step survey with personalized questions
- **Modern UI**: Beautiful interface with Tailwind CSS and pink theme
- **Type-Safe**: Full TypeScript support across frontend and backend
- **Monorepo Structure**: Organized codebase with shared types and utilities

## 🏗️ Architecture

This project uses a monorepo structure with Yarn workspaces:

```
zodiac-predictor/
├── apps/
│   ├── web/          # React frontend (Vite + TypeScript + Tailwind)
│   └── api/          # Express backend (TypeScript + MVC)
├── packages/
│   └── shared/       # Common types & utilities
├── docs/             # Project documentation
└── package.json      # Root workspace configuration
```

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom pink theme
- **React Router** for navigation

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **MVC architecture** for organized code structure
- **Security middleware** (Helmet, CORS, Rate Limiting)

### Shared

- **Custom types package** for consistent interfaces
- **Utility functions** for common operations
- **Constants** for application-wide values

### Development Tools

- **ESLint** + **Prettier** for code quality
- **Husky** for Git hooks
- **Yarn workspaces** for monorepo management

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Yarn 4.0 or higher

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd zodiac-predictor
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

```bash
# Copy example environment file for API
cp apps/api/.env.example apps/api/.env
```

### Development

Start both frontend and backend in development mode:

```bash
yarn dev
```

This will start:

- Frontend on http://localhost:3000
- Backend API on http://localhost:3001

### Available Scripts

- `yarn dev` - Start both apps in development mode
- `yarn build` - Build all packages for production
- `yarn test` - Run tests across all packages
- `yarn lint` - Lint code across all packages
- `yarn lint:fix` - Fix linting issues
- `yarn format` - Format code with Prettier
- `yarn type-check` - Check TypeScript types
- `yarn clean` - Clean build outputs and dependencies

### Individual Package Commands

You can also run commands for specific packages:

```bash
# Frontend only
yarn workspace @zodiac/web dev
yarn workspace @zodiac/web build

# Backend only
yarn workspace @zodiac/api dev
yarn workspace @zodiac/api build

# Shared package
yarn workspace @zodiac/shared build
```

## 📁 Project Structure

### Frontend (`apps/web/`)

- `src/components/` - React components
- `src/pages/` - Page components
- `src/hooks/` - Custom React hooks (future)
- `src/services/` - API communication (future)
- `src/types/` - Frontend-specific types

### Backend (`apps/api/`)

- `src/controllers/` - Request handlers
- `src/services/` - Business logic
- `src/routes/` - API route definitions
- `src/middleware/` - Express middleware
- `src/models/` - Data models (future)
- `src/utils/` - Utility functions

### Shared (`packages/shared/`)

- `src/types/` - Shared TypeScript interfaces
- `src/constants/` - Application constants
- `src/utils/` - Shared utility functions

## 🔧 Configuration

### ESLint

- Configured for TypeScript, React, and Node.js
- Extends recommended rules with custom overrides
- Separate rules for frontend and backend

### Prettier

- Consistent code formatting
- Single quotes, no semicolons
- 100 character line width

### Husky

- Pre-commit hooks for linting and formatting
- Ensures code quality before commits

## 🚀 Deployment

### Development

```bash
yarn build
yarn start
```

### Production

The application is ready for deployment to platforms like:

- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Render, or any Node.js hosting

## 📚 API Documentation

### Health Check

```
GET /health
```

### Zodiac Endpoints

```
GET /api/zodiac/signs
GET /api/zodiac/compatibility/:sign1/:sign2
POST /api/zodiac/analyze
```

### Survey Endpoints

```
POST /api/survey/submit
GET /api/survey/results/:id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🔮 Future Enhancements

- User authentication and profiles
- Database integration (Supabase)
- AI-powered personality analysis
- Social sharing features
- Mobile app version
- Advanced compatibility algorithms

---

Made with ✨ and TypeScript
