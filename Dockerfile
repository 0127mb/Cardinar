# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env

# Render injects PORT at runtime. Local Docker defaults to 3001.
ENV PORT=3001
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/health', (r) => {if (r.statusCode !== 200) process.exit(1)}).on('error', () => process.exit(1))"

# Start application
CMD ["node", "dist/main"]
