# Stage 1: Build the React frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Node.js backend and serve the frontend
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy the built React app to a public folder in the backend
COPY --from=build-frontend /app/frontend/dist ./public

# Update server.js to serve static files from the public folder (we'll modify server.js next)

EXPOSE 8080
CMD ["node", "server.js"]
