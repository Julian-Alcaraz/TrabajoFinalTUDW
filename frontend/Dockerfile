# Usar una imagen base de Node.js
FROM node:22

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /home/app/frontend

# Copiar solo package y package lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm ci

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiar los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto 4200 para Angular en desarrollo
EXPOSE 4200

# Comando para iniciar la aplicación en modo desarrollo , CAMBIARLO DESPUES
# CMD ["npm", "start"]
