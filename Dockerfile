FROM node:18.10-alpine

WORKDIR /app

COPY package.json .
COPY .env .
COPY . .


RUN yarn install
RUN yarn build
RUN npx prisma generate


CMD ["node", "dist/main"]