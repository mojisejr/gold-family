FROM node:alpine

WORKDIR /app

COPY package*.json ./
COPY  prisma ./prisma/
COPY .env ./
COPY . .


RUN yarn install
RUN npx prisma generate
RUN yarn build


CMD ["node", "dist/main"]