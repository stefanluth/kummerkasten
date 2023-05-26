FROM node:20.2.0-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npx prisma migrate deploy
RUN npx prisma generate
CMD ["npm", "run", "start"]
EXPOSE 3000
