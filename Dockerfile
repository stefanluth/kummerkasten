FROM node:20.2.0-alpine
RUN apk add --no-cache curl python3 py3-pip
WORKDIR /kummerkasten

COPY .env .
COPY next.config.js .
COPY package.json .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY tsconfig.json .
COPY run.sh .
COPY middleware.ts .

COPY prisma ./prisma
COPY utils ./utils
COPY app ./app

RUN npm install
RUN npm run prepare:db
RUN npm run build

EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s \
    CMD curl -L -f http://localhost:3000/ || exit 1

CMD ["npm", "run", "start"]
