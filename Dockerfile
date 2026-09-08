# ── Stage 1: Install dependencies ──
FROM node:20-alpine AS deps
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/contracts/package.json packages/contracts/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile

# ── Stage 2: Build contracts ──
FROM deps AS build-contracts
WORKDIR /app
COPY packages/contracts packages/contracts
COPY tsconfig.base.json .
RUN pnpm --filter @platform/contracts build

# ── Stage 3: Build API ──
FROM build-contracts AS build-api
COPY apps/api apps/api
RUN pnpm --filter @platform/api run db:generate
RUN pnpm --filter @platform/api build

# ── Stage 4: Build Web ──
FROM build-contracts AS build-web
COPY apps/web apps/web
RUN pnpm --filter @platform/web build

# ── Stage 5: Production API image ──
FROM node:20-alpine AS api
RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=build-api /app/node_modules node_modules
COPY --from=build-api /app/packages/contracts packages/contracts
COPY --from=build-api /app/apps/api/dist apps/api/dist
COPY --from=build-api /app/apps/api/prisma apps/api/prisma
COPY --from=build-api /app/apps/api/node_modules apps/api/node_modules
COPY apps/api/package.json apps/api/
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/contracts/package.json packages/contracts/
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

# ── Stage 6: Production Web image (nginx) ──
FROM nginx:alpine AS web
COPY --from=build-web /app/apps/web/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
