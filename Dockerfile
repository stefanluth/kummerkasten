FROM node:20.2.0-alpine
RUN apk add --no-cache python3 py3-pip
WORKDIR /app
COPY app ./app
COPY prisma ./prisma
COPY utils ./utils
COPY .env .
COPY next.config.js .
COPY package.json .
COPY tsconfig.json .
COPY run.sh .

RUN npm install
RUN npm run build
RUN npx prisma migrate deploy
RUN npx prisma generate

EXPOSE 3000
CMD ["sh", "/app/run.sh"]
