FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm audit fix

COPY . .

RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "run", "start"]