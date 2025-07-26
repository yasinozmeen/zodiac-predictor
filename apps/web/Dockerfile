# ==============================================================================
# ZODIAC PREDICTOR WEB - DOCKERFILE
# ==============================================================================
# Multi-stage Dockerfile for the frontend React application
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
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# ==============================================================================
# DEVELOPMENT STAGE
# ==============================================================================
FROM base AS development

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# Copy source code
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared

# Build shared package
RUN yarn workspace @zodiac/shared build

# Set development environment
ENV NODE_ENV=development
ENV VITE_API_BASE_URL=http://localhost:3001

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command for development (with host binding for Docker)
CMD ["yarn", "workspace", "@zodiac/web", "dev", "--host", "0.0.0.0"]

# ==============================================================================
# PRODUCTION BUILD STAGE
# ==============================================================================
FROM base AS build

# Install all dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared

# Build shared package
RUN yarn workspace @zodiac/shared build

# Set production environment variables
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=http://localhost:3001

# Build the application
RUN yarn workspace @zodiac/web build

# ==============================================================================
# PRODUCTION STAGE (NGINX)
# ==============================================================================
FROM nginx:alpine AS production

# Copy built application from build stage
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user for security
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 -G nginx

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]