FROM node:18-alpine AS build

WORKDIR /backend/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
