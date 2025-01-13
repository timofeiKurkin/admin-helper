FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./ /app/

RUN npm run build

ENV NODE_ENV production

EXPOSE 3030

CMD ["npm", "run", ]