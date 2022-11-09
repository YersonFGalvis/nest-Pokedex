
# #DOCKER FILE SIMPLE

# # Usar la imagen de node version 18
# FROM node:18-alpine3.15

# # Set working directory
# # creamos y seteamos un directorio como espacio de   trabajo
# RUN mkdir -p /var/www/pokedex
# WORKDIR /var/www/pokedex

# # Copiar el directorio y su contenido

# # copie todo lo que esta en el directorio raiz, que es donde esta
# # mi Dockerfile, toda mi app, a la carpeta /var/www/pokedex

# # debemos asegurarnos que el node_modules y demas archivos que no queremos en nuestro 
# # contenedor, se encunetre en el .dockerignore
# COPY . ./var/www/pokedex
# COPY package.json tsconfig.json tsconfig.build.json /var/www/pokedex/

# #instalamos solo las dependencias de produccion
# RUN yarn install --prod
# RUN yarn build


# # Dar permiso para ejecutar la applicación
# # buena practica crear un nuevo usuario y no el de
# # por defecto del contenedor de linux alpine 
# RUN adduser --disabled-password pokeuser
# # se le da acceso a ese usuario 
# # unicamente a ese directorio
# RUN chown -R pokeuser:pokeuser /var/www/pokedex
# USER pokeuser

# # Limpiar el caché
# RUN yarn cache clean --force

# EXPOSE 3000

# #despues de hacer todo eso, ejecute yarn start
# # para que inicie el servidor

# CMD [ "yarn","start" ]


#DOCKER FILE 

# Install dependencies only when needed
FROM node:18-alpine3.15 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the app with cache dependencies
FROM node:18-alpine3.15 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


# Production image, copy all the files and run next
FROM node:18-alpine3.15 AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --prod

COPY --from=builder /app/dist ./dist

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

CMD [ "node","dist/main" ]