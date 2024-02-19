FROM node:21-alpine as dependencies
WORKDIR /kummerkasten

COPY package.json .
RUN npm install --omit=dev

FROM node:21-alpine as build
WORKDIR /kummerkasten

COPY --from=dependencies /kummerkasten/node_modules ./node_modules
COPY --from=dependencies /kummerkasten/package-lock.json ./package-lock.json

COPY .env .
COPY next.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY tsconfig.json .
COPY package.json .
COPY middleware.ts .

COPY prisma/schema.prisma ./prisma/schema.prisma
COPY utils ./utils
COPY app ./app

RUN npx prisma generate
RUN npx next build

FROM node:21-alpine as production
WORKDIR /kummerkasten

RUN apk update
RUN apk add --no-cache openssl

COPY --from=build /kummerkasten .
COPY faq.en.md .

EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s \
    CMD curl -L -f http://localhost:3000/ || exit 1

ENV NEXT_TELEMETRY_DISABLED 1
CMD ["npm", "run", "start"]
