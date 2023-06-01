FROM node:20.2.0-alpine
RUN apk add --no-cache python3 py3-pip
WORKDIR /kummerkasten
COPY app ./app
COPY prisma ./prisma
COPY utils ./utils
COPY .env .
COPY next.config.js .
COPY package.json .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY tsconfig.json .
COPY run.sh .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["sh", "/kummerkasten/run.sh"]
