# 🔧 Troubleshooting Guide

Quick solutions for common development issues.

## 🚨 Common Issues

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**

```bash
# Find process using the port
lsof -i :3000
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3002 yarn dev
```

### Environment Variables Not Loading

**Problem:** `Missing required environment variables`

**Solution:**

```bash
# Check if .env files exist
ls -la .env apps/api/.env apps/web/.env

# Copy examples if missing
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Verify content
cat apps/api/.env
```

### Module Resolution Errors

**Problem:** `Cannot resolve module '@zodiac/shared'`

**Solution:**

```bash
# Clean and reinstall
yarn clean
rm -rf node_modules apps/*/node_modules packages/*/node_modules
yarn install

# Build shared package
yarn workspace @zodiac/shared build
```

### TypeScript Compilation Errors

**Problem:** Various TypeScript errors

**Solution:**

```bash
# Run type checking
yarn type-check

# Clean TypeScript cache
rm -rf */tsconfig.tsbuildinfo apps/*/tsconfig.tsbuildinfo

# Restart TypeScript server in VSCode
Cmd+Shift+P > "TypeScript: Restart TS Server"
```

### Database Connection Issues

**Problem:** `Connection to database failed`

**Solution:**

```bash
# Check Supabase credentials
yarn workspace @zodiac/api db:seed:status

# Verify environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Test connection
curl -H "apikey: YOUR_ANON_KEY" YOUR_SUPABASE_URL/rest/v1/
```

### Hot Reload Not Working

**Problem:** Changes not reflecting in browser

**Solution:**

```bash
# Frontend (Vite)
# Check if HMR is enabled in vite.config.ts
server: {
  hmr: true
}

# Backend (tsx watch)
# Restart development server
yarn workspace @zodiac/api dev

# Clear browser cache
Cmd+Shift+R (macOS) / Ctrl+Shift+R (Windows/Linux)
```

### Package Manager Issues

**Problem:** Yarn workspace commands failing

**Solution:**

```bash
# Check Yarn version
yarn --version  # Should be >=4.0.0

# Update Yarn
yarn set version stable

# Verify workspace configuration
cat package.json | grep workspaces
```

## 🐳 Docker Issues

### Container Build Failures

**Problem:** Docker build failing

**Solution:**

```bash
# Clean Docker cache
docker system prune -a

# Build with no cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker build -t test-build apps/api/
```

### Container Not Starting

**Problem:** Services not starting in Docker

**Solution:**

```bash
# Check service logs
docker-compose logs api
docker-compose logs web

# Check container status
docker-compose ps

# Restart specific service
docker-compose restart api
```

### Volume Mount Issues

**Problem:** File changes not syncing

**Solution:**

```bash
# Check volume mounts
docker-compose config

# Restart with volume recreation
docker-compose down -v
docker-compose up
```

## 🖥 Platform-Specific Issues

### Windows

**Problem:** Line ending issues

**Solution:**

```bash
# Configure Git
git config --global core.autocrlf input
git config --global core.eol lf

# Re-clone repository
git rm --cached -r .
git reset --hard
```

**Problem:** Permission errors

**Solution:**

```bash
# Run as administrator
# Or use WSL2 for better compatibility
```

### macOS

**Problem:** Missing build tools

**Solution:**

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install dependencies via Homebrew
brew install node yarn
```

### Linux

**Problem:** Permission denied

**Solution:**

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Or use node version manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

## 📱 Browser Issues

### CORS Errors

**Problem:**
`Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**

```bash
# Check backend CORS configuration
# In apps/api/src/index.ts
app.use(cors({
  origin: 'http://localhost:3000'
}))

# Verify FRONTEND_URL in .env
FRONTEND_URL=http://localhost:3000
```

### Console Errors

**Problem:** JavaScript errors in browser console

**Solution:**

```bash
# Enable detailed errors in development
# apps/web/.env
VITE_DETAILED_ERRORS=true

# Check browser developer tools
# Network tab for failed requests
# Console tab for JavaScript errors
```

## 🧪 Testing Issues

### Tests Failing

**Problem:** Jest/Vitest tests not running

**Solution:**

```bash
# Run specific test suite
yarn workspace @zodiac/api test
yarn workspace @zodiac/web test

# Run with verbose output
yarn workspace @zodiac/api test --verbose

# Clear test cache
yarn workspace @zodiac/api test --clearCache
```

### Database Tests Failing

**Problem:** Database-related tests failing

**Solution:**

```bash
# Check test database setup
# Ensure test environment variables are set
NODE_ENV=test yarn workspace @zodiac/api test

# Reset test database
yarn workspace @zodiac/api db:seed:clean
yarn workspace @zodiac/api db:seed:json
```

## 🚀 Performance Issues

### Slow Development Server

**Problem:** Slow startup or reload times

**Solution:**

```bash
# Disable source maps temporarily
# vite.config.ts
build: {
  sourcemap: false
}

# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Check for large files in src/
find . -name "*.js" -o -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -n
```

### Memory Leaks

**Problem:** High memory usage

**Solution:**

```bash
# Monitor memory usage
htop
Activity Monitor (macOS)
Task Manager (Windows)

# Restart development servers
yarn dev  # This will restart both frontend and backend
```

## 🆘 Getting Help

If issues persist:

1. **Check logs carefully** - Error messages often contain the solution
2. **Search documentation** - Review the Developer Guide
3. **Check GitHub issues** - Someone might have faced the same problem
4. **Create minimal reproduction** - Isolate the problem
5. **Ask for help** - Create a detailed issue report

### Creating a Good Issue Report

Include:

- **Environment details**: OS, Node.js version, Yarn version
- **Steps to reproduce**: Exact commands and actions
- **Error messages**: Full error output
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable

---

**Remember:** Most issues are environment-related. When in doubt, try a clean
installation! 🧹
