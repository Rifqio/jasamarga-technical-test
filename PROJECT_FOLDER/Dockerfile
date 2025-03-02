FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install -g typescript

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
