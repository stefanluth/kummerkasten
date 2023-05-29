FROM node:20.2.0-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
