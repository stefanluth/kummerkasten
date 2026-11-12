FROM node:24-alpine AS prod-deps
WORKDIR /kummerkasten

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS build
WORKDIR /kummerkasten

RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npx next build

FROM node:24-alpine AS production
WORKDIR /kummerkasten

RUN apk add --no-cache openssl curl libc6-compat

COPY --from=prod-deps /kummerkasten/node_modules ./node_modules
COPY --from=build /kummerkasten/.next ./.next
COPY package.json next.config.js .env faq.en.md ./

EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s \
    CMD curl -L -f http://localhost:3000/ || exit 1

ENV NEXT_TELEMETRY_DISABLED 1
CMD ["npm", "run", "start"]
