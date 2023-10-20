FROM node:21
RUN apt install curl

ENV NEXT_TELEMETRY_DISABLED 1
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

RUN npm install
RUN npm run prepare:db
RUN npm run build

EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s \
    CMD curl -L -f http://localhost:3000/ || exit 1

CMD ["npm", "run", "start"]
