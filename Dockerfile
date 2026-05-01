# Stage 1: Build the React frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Node.js backend and serve the frontend
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY backend/ ./

# Remove test files and .env from production image
RUN rm -rf tests/ .env

# Copy the built React app to a public folder in the backend
COPY --from=build-frontend /app/frontend/dist ./public

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Health check using the health endpoint
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

EXPOSE 8080
CMD ["node", "server.js"]
