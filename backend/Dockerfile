# ---- Stage 1: Build ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm (fast) – you can also use npm or yarn
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# ---- Stage 2: Production ----
FROM node:20-alpine
WORKDIR /app

# Copy only production dependencies + built files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
