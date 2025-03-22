FROM node:22.14.0-alpine

WORKDIR /home/app/frontend

COPY package*.json ./

RUN npm ci

COPY . .

# No es necesario guardar los archivos, solo se construye en /home/app/frontend/dist
RUN npm run build -- --output-path=/home/app/frontend/dist

CMD ["echo", "Frontend buildeado"]
