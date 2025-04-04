FROM node:22.14.0-alpine

WORKDIR /home/app/backend

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
