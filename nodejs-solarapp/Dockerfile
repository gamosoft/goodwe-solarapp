FROM node:19.7.0-alpine3.17

WORKDIR /app

COPY package*.json .
RUN npm install --production
COPY . .

CMD npm start