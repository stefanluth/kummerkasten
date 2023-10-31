FROM node:21 as build
WORKDIR /kummerkasten

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

RUN npm install --omit=dev
RUN npm run prepare:db
RUN npm run build

FROM node:21-slim as production
WORKDIR /kummerkasten

RUN apt-get update -y
RUN apt-get install -y openssl

COPY --from=build /kummerkasten .

EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s \
    CMD curl -L -f http://localhost:3000/ || exit 1

ENV NEXT_TELEMETRY_DISABLED 1
CMD ["npm", "run", "start"]
