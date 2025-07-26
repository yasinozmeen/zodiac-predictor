# ==============================================================================
# ZODIAC PREDICTOR API - DOCKERFILE
# ==============================================================================
# Multi-stage Dockerfile for the backend API service
# Supports both development and production builds
# ==============================================================================

# Base image with Node.js LTS
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    curl \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json yarn.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# ==============================================================================
# DEVELOPMENT STAGE
# ==============================================================================
FROM base AS development

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Build shared package
RUN yarn workspace @zodiac/shared build

# Set development environment
ENV NODE_ENV=development
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command for development
CMD ["yarn", "workspace", "@zodiac/api", "dev"]

# ==============================================================================
# PRODUCTION BUILD STAGE
# ==============================================================================
FROM base AS build

# Install all dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Build shared package
RUN yarn workspace @zodiac/shared build

# Build API
RUN yarn workspace @zodiac/api build

# ==============================================================================
# PRODUCTION STAGE
# ==============================================================================
FROM base AS production

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built application from build stage
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/packages/shared/dist ./packages/shared/dist

# Copy package.json files for runtime
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Set production environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["yarn", "workspace", "@zodiac/api", "start"]