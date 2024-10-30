FROM node:20.12.2

RUN apt-get update && apt-get install -y supervisor bash

WORKDIR /app

COPY ./backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install && npm cache clean --force

WORKDIR /app

COPY ./backend ./backend/

COPY ./frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps && npm cache clean --force

WORKDIR /app

COPY ./frontend ./frontend/

RUN mkdir -p /app/temporary-storage && \
    chmod 774 /app/temporary-storage

COPY ./supervisord.conf /etc/supervisord.conf

EXPOSE 3000 4200

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
