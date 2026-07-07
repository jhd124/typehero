FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git openssl \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable \
  && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./
COPY patches ./patches
RUN mkdir -p apps/web apps/admin \
  packages/auth packages/db packages/monaco packages/og-utils packages/redis packages/ui \
  tooling/config-eslint tooling/config-tailwind tooling/config-typescript tooling/github-actions tooling/scripts
COPY apps/web/package.json ./apps/web/package.json
COPY apps/admin/package.json ./apps/admin/package.json
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/monaco/package.json ./packages/monaco/package.json
COPY packages/og-utils/package.json ./packages/og-utils/package.json
COPY packages/redis/package.json ./packages/redis/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY tooling/config-eslint/package.json ./tooling/config-eslint/package.json
COPY tooling/config-tailwind/package.json ./tooling/config-tailwind/package.json
COPY tooling/config-typescript/package.json ./tooling/config-typescript/package.json
COPY tooling/github-actions/package.json ./tooling/github-actions/package.json
COPY tooling/scripts/package.json ./tooling/scripts/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS builder

COPY apps/web ./apps/web
COPY apps/admin ./apps/admin
COPY packages ./packages
COPY tooling ./tooling
COPY challenges ./challenges

ARG APP_URL="http://localhost:3000"
ARG NEXT_PUBLIC_APP_URL="http://localhost:3000"
ARG ADMIN_URL="http://localhost:3001"
ARG NEXTAUTH_URL="http://localhost:3000"

ENV NODE_ENV=production
ENV DATABASE_URL="mysql://root:dev@db:3306/typehero"
ENV REDIS_URL="redis://redis:6379"
ENV APP_URL=$APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV ADMIN_URL=$ADMIN_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET="docker-build-placeholder"
ENV AUTH_SECRET="docker-build-placeholder"
ENV GITHUB_ID="docker-build-placeholder"
ENV GITHUB_SECRET="docker-build-placeholder"
ENV STRIPE_SECRET_KEY="docker-build-placeholder"
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="docker-build-placeholder"
ENV UPLOADTHING_SECRET="docker-build-placeholder"
ENV UPLOADTHING_APP_ID="docker-build-placeholder"
ENV NEXT_PUBLIC_ALGOLIA_APP_ID="docker-build-placeholder"
ENV NEXT_PUBLIC_ALGOLIA_API_KEY="docker-build-placeholder"

RUN pnpm --filter @repo/db exec prisma generate
RUN pnpm --filter web build \
  && pnpm --filter admin build

FROM builder AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "exec", "next", "start", "-p", "3000"]
