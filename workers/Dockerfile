FROM node:20.12.2

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npx", "ts-node", "videoWorker.ts"]
