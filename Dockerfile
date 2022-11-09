# Usar la imagen de node version 18
FROM node:18-alpine3.15

# Set working directory
# creamos y seteamos un directorio como espacio de   trabajo
RUN mkdir -p /var/www/pokedex
WORKDIR /var/www/pokedex

# Copiar el directorio y su contenido

# copie todo lo que esta en el directorio raiz, que es donde esta
# mi Dockerfile, toda mi app, a la carpeta /var/www/pokedex

# debemos asegurarnos que el node_modules y demas archivos que no queremos en nuestro 
# contenedor, se encunetre en el .dockerignore
COPY . ./var/www/pokedex
COPY package.json tsconfig.json tsconfig.build.json /var/www/pokedex/

#instalamos solo las dependencias de produccion
RUN yarn install --prod
RUN yarn build


# Dar permiso para ejecutar la applicación
# buena practica crear un nuevo usuario y no el de
# por defecto del contenedor de linux alpine 
RUN adduser --disabled-password pokeuser
# se le da acceso a ese usuario 
# unicamente a ese directorio
RUN chown -R pokeuser:pokeuser /var/www/pokedex
USER pokeuser

# Limpiar el caché
RUN yarn cache clean --force

EXPOSE 3000

#despues de hacer todo eso, ejecute yarn start
# para que inicie el servidor

CMD [ "yarn","start" ]