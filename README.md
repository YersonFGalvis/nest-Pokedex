<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Execute in development

1. clone the repository
2. execute

```
yarn install
```
3. have NEST CLI already installed

```
npm i -g @nestjs/cli
```

4. run the database up

```
docker-compose up -d
```

5. Clone the file ```.env.template``` and rename the copy to
```.env```

6. Fill the environment variables defined in the ```.env```

7. Run the server
yarn start:dev

8. Build the database with seed
```
http://localhost:3000/api/v1/seed
```

## Stack Used
* MongoDB - Mongoose
* Nestjs

# Production Build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# DOCKERIZATION

## Build
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

## Run
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up

## Nota
Por defecto, __docker-compose__ usa el archivo ```.env```, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con
```
docker-compose -f docker-compose.prod.yaml up --build
```

# Notas
Heroku redeploy sin cambios:
```
git commit --allow-empty -m "Tigger Heroku Deploy"
git push heroku <master|main>
```