FROM node:20.12.2

WORKDIR /app/workers

COPY workers/package*.json ./

RUN npm install

COPY backend ./backend
COPY utils ./utils

COPY workers/. ./

CMD ["npx", "ts-node", "videoWorker.ts"]
