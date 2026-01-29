# ---------------------------------------------------
# 1) Build stage
# ---------------------------------------------------
FROM node:23-alpine AS builder
WORKDIR /app

# Copy only package files for faster caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build Vite project
RUN npm run build


# ---------------------------------------------------
# 2) Production stage
# ---------------------------------------------------
FROM node:23-alpine
WORKDIR /app

# Install 'serve' to host static files
RUN npm install -g serve

# Copy build output from Vite
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start static server
CMD ["serve", "-s", "dist", "-l", "3000"]
