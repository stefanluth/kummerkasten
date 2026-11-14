FROM node:24-alpine AS build
WORKDIR /kummerkasten

RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN KUMMERKASTEN_POSTGRES_URL_NON_POOLING=postgresql://build:build@localhost:5432/build \
    npx prisma generate
RUN UNLOCK_PASSWORD=build \
    DELETE_PASSWORD=build \
    SESSION_SECRET=build-only-session-secret-not-for-runtime \
    KUMMERKASTEN_POSTGRES_PRISMA_URL=postgresql://build:build@localhost:5432/build \
    KUMMERKASTEN_POSTGRES_URL_NON_POOLING=postgresql://build:build@localhost:5432/build \
    npx next build

FROM node:24-alpine AS production
WORKDIR /kummerkasten

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=build --chown=nextjs:nodejs /kummerkasten/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /kummerkasten/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /kummerkasten/faq.en.md ./faq.en.md

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/api/health', { signal: AbortSignal.timeout(4000) }).then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
