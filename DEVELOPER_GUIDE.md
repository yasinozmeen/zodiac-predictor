# 🌟 Zodiac Predictor - Developer Guide

Welcome to the Zodiac Predictor development environment! This guide will help
you set up your local development environment and understand the project
structure.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development Workflow](#development-workflow)
- [Available Commands](#available-commands)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Testing](#testing)
- [Docker Development](#docker-development)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
cd zodiac-predictor
yarn install

# 2. Set up environment
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Configure Supabase credentials in .env files

# 4. Start development servers
yarn dev

# 5. Open http://localhost:3000 (frontend) and http://localhost:3001 (backend)
```

## 📋 Prerequisites

### Required Software

- **Node.js** >= 18.0.0
- **Yarn** >= 4.0.0 (Package Manager)
- **Git** (Version Control)

### Optional Software

- **Docker** & **Docker Compose** (For containerized development)
- **PostgreSQL** (If not using Supabase)
- **Redis** (For caching, if implemented)

### External Services

- **Supabase Account** (Database & Authentication)
  - Create project at [supabase.com](https://supabase.com)
  - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`

## 📥 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd zodiac-predictor
```

### 2. Install Dependencies

```bash
yarn install
```

This installs dependencies for all workspaces (frontend, backend, shared).

### 3. Environment Setup

```bash
# Root level environment
cp .env.example .env

# Backend environment
cp apps/api/.env.example apps/api/.env

# Frontend environment
cp apps/web/.env.example apps/web/.env
```

### 4. Configure Environment Variables

Edit the `.env` files with your actual values:

**apps/api/.env:**

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**apps/web/.env:**

```bash
VITE_API_BASE_URL=http://localhost:3001
```

## 🔄 Development Workflow

### Starting Development

```bash
# Start both frontend and backend
yarn dev

# Or start individually
yarn workspace @zodiac/web dev    # Frontend only
yarn workspace @zodiac/api dev    # Backend only
```

### Hot Reload

- **Frontend**: Vite provides instant hot module replacement
- **Backend**: tsx watch restarts server on file changes
- **Shared Package**: Changes trigger rebuilds automatically

### Making Changes

1. **Frontend changes**: Edit files in `apps/web/src/`
2. **Backend changes**: Edit files in `apps/api/src/`
3. **Shared types/utils**: Edit files in `packages/shared/src/`

## 🛠 Available Commands

### Root Level Commands

```bash
# Development
yarn dev              # Start both frontend and backend
yarn build            # Build all workspaces
yarn test             # Run all tests
yarn lint             # Lint all workspaces
yarn lint:fix         # Fix linting issues
yarn type-check       # TypeScript checking
yarn format           # Format code with Prettier
yarn clean            # Clean all build artifacts

# Package management
yarn workspace <workspace> <command>  # Run command in specific workspace
```

### Backend API Commands

```bash
# In apps/api/ or using yarn workspace @zodiac/api <command>
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn test             # Run tests
yarn test:watch       # Run tests in watch mode
yarn lint             # Lint TypeScript files
yarn type-check       # Check TypeScript types

# Database commands
yarn db:seed          # Run SQL seed files
yarn db:seed:json     # Run JSON seed files
yarn db:seed:status   # Check seed status
yarn db:seed:validate # Validate seed data
yarn db:seed:clean    # Clean up seed data
```

### Frontend Web Commands

```bash
# In apps/web/ or using yarn workspace @zodiac/web <command>
yarn dev              # Start development server
yarn build            # Build for production
yarn preview          # Preview production build
yarn test             # Run tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Run tests with coverage
yarn lint             # Lint React/TypeScript files
yarn type-check       # Check TypeScript types
```

## 🌍 Environment Configuration

### Development Environment

**Ports:**

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

**Default Configuration:**

- Hot reload enabled
- Source maps enabled
- Detailed error messages
- Development logging

### Environment Variables

**Required:**

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (backend only)

**Optional:**

- `PORT` - Backend port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `JWT_SECRET` - JWT signing secret
- `RATE_LIMIT_*` - Rate limiting configuration

## 🗄 Database Setup

### Using Supabase (Recommended)

1. Create Supabase project
2. Run migrations (automatic with Supabase)
3. Seed data using provided scripts

```bash
# Check current seed status
yarn workspace @zodiac/api db:seed:status

# Run JSON-based seeding
yarn workspace @zodiac/api db:seed:json

# Validate seed data
yarn workspace @zodiac/api db:seed:validate
```

### Local PostgreSQL (Alternative)

```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Create database
createdb zodiac_dev

# Update .env with local database URL
DATABASE_URL=postgresql://username:password@localhost:5432/zodiac_dev
```

## 🧪 Testing

### Running Tests

```bash
# All tests
yarn test

# Frontend tests only
yarn workspace @zodiac/web test

# Backend tests only
yarn workspace @zodiac/api test

# Watch mode
yarn workspace @zodiac/web test:watch
yarn workspace @zodiac/api test:watch

# Coverage
yarn workspace @zodiac/web test:coverage
```

### Test Structure

- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest
- **Shared**: Jest for utilities

### Writing Tests

```typescript
// Frontend component test
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

test('renders correctly', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})

// Backend API test
import request from 'supertest'
import app from '../app'

test('GET /api/v1/health', async () => {
  const response = await request(app)
    .get('/api/v1/health')
    .expect(200)

  expect(response.body.status).toBe('OK')
})
```

## 🐳 Docker Development

### Quick Start with Docker

```bash
# Start all services
docker-compose up

# Start specific services
docker-compose up postgres redis

# Start with admin tools
docker-compose --profile admin up
```

### Docker Services

- **postgres**: PostgreSQL database
- **redis**: Redis cache (optional)
- **api**: Backend API service
- **web**: Frontend web service
- **pgadmin**: Database admin tool (optional)

### Docker Commands

```bash
# Build images
docker-compose build

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Execute commands in containers
docker-compose exec api yarn test
docker-compose exec web yarn lint

# Clean up
docker-compose down -v  # Remove volumes
docker-compose down --rmi all  # Remove images
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 <PID>
```

#### Module Resolution Issues

```bash
# Clear cache and reinstall
yarn clean
rm -rf node_modules
yarn install
```

#### TypeScript Errors

```bash
# Run type checking
yarn type-check

# Clear TypeScript cache
rm -rf apps/*/tsconfig.tsbuildinfo
```

#### Database Connection Issues

```bash
# Check Supabase credentials
yarn workspace @zodiac/api db:seed:status

# Verify environment variables
cat apps/api/.env
```

### Performance Issues

#### Slow Development Server

```bash
# Check if source maps are enabled
# Disable in vite.config.ts if needed
build: {
  sourcemap: false
}
```

#### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

### Platform-Specific Issues

#### Windows

- Use WSL2 for better performance
- Ensure line endings are set to LF
- Use PowerShell or Command Prompt

#### macOS

- Install Xcode Command Line Tools
- Use Homebrew for dependencies

#### Linux

- Install build essentials
- Ensure proper file permissions

## 📁 Project Structure

```
zodiac-predictor/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── services/    # API services
│   │   │   └── types/       # Frontend types
│   │   ├── public/          # Static assets
│   │   └── package.json
│   └── api/                 # Express backend
│       ├── src/
│       │   ├── controllers/ # Request handlers
│       │   ├── routes/      # API routes
│       │   ├── services/    # Business logic
│       │   ├── models/      # Data models
│       │   ├── middleware/  # Express middleware
│       │   ├── database/    # DB migrations & seeds
│       │   └── utils/       # Utilities
│       └── package.json
├── packages/
│   └── shared/              # Shared types & utilities
│       ├── src/
│       │   ├── types/       # Shared types
│       │   ├── constants/   # Shared constants
│       │   └── utils/       # Shared utilities
│       └── package.json
├── docs/                    # Documentation
├── .env.example             # Environment template
├── docker-compose.yml       # Docker configuration
├── package.json             # Root workspace config
└── README.md               # Project overview
```

## 📚 Additional Resources

- [Coding Standards](docs/architecture/coding-standards.md)
- [Tech Stack Documentation](docs/architecture/tech-stack.md)
- [Source Tree Structure](docs/architecture/source-tree.md)
- [API Documentation](docs/api/)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes following coding standards
3. Write/update tests
4. Run linting and tests: `yarn lint && yarn test`
5. Commit with conventional commits
6. Push and create Pull Request

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Search existing issues
3. Create new issue with:
   - Environment details
   - Steps to reproduce
   - Error messages
   - Expected vs actual behavior

---

Happy coding! 🚀
