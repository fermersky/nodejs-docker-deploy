FROM node:18.7.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --production

COPY . .

EXPOSE 4444

CMD ["node", "index.js"]