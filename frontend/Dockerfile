FROM node:22.14.0-alpine

WORKDIR /home/app/frontend

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --output-path=/home/app/frontend/dist

CMD ["echo", "Frontend buildeado"]
