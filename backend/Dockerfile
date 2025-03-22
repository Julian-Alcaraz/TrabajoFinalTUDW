# Usar una imagen base de Node.js
FROM node:22.14.0-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /home/app/backend

# Copiar solo package y package lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm ci

# Copiar config. de app
# Quiza no haga falta, probar sacarlo.
#############COPY ./config/.env.prod /home/app/backend/config/.env

# Copiar los archivos del proyecto al contenedor
COPY . .


# Esperamos que el frontend esté buildeado antes de compilar el backend
####RUN test -d /home/app/backend/frontend && echo "Frontend presente" || (echo "Falta el frontend" && exit 1)

# Compilar la app
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Ejecutar la app compilada
CMD ["node", "dist/main.js"]
