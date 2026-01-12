FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Start fresh from a clean Node.js image
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl && \
    addgroup -g 1001 -S nodejs && \
    adduser -S sveltekit -u 1001

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

RUN chown -R sveltekit:nodejs /app

USER sveltekit

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/api/health || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy && node build"]