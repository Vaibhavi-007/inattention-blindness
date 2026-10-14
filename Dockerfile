# Lightweight single-service container for Inattention Blindness Prototype
FROM node:20-alpine

WORKDIR /app

# Copy application files
COPY package.json ./
COPY server.js ./
COPY public ./public
COPY data ./data

# Expose HTTP port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start command (zero external dependencies required)
CMD ["node", "server.js"]
