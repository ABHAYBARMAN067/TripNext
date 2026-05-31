# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG MONGODB_URI=mongodb://127.0.0.1:27017/tripnest-ci
ARG MONGO_URI=mongodb://127.0.0.1:27017/tripnest-ci
ARG NEXTAUTH_URL=http://localhost:3000
ARG NEXTAUTH_SECRET=ci-secret
ARG JWT_SECRET=ci-secret
ENV MONGODB_URI=$MONGODB_URI
ENV MONGO_URI=$MONGO_URI
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV JWT_SECRET=$JWT_SECRET
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start"]

