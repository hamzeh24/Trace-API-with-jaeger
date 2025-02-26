FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install
RUN npm install prom-client

COPY . .
EXPOSE 3000

CMD ["node", "length.js"]