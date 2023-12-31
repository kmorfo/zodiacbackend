# Inicializamos el proyecto cargando las librerias necesarias
FROM node:19-alpine3.15 as dev
WORKDIR /app
COPY package.json ./
RUN yarn install
CMD [ "yarn","start:dev" ]

#    --frozen-lockfile para congelar las versiones utilizadas y no cambien
FROM node:19-alpine3.15 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --frozen-lockfile

# Copia los node_modules del stage anterior y realiza el build
FROM node:19-alpine3.15 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Creamos las dependencias de produccion --prod
FROM node:19-alpine3.15 as prod-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --prod --frozen-lockfile

# Copiamos todo lo necesario para que funcione la imagen y lanzamos la misma
FROM node:19-alpine3.15 as prod
EXPOSE 3001
WORKDIR /app
ENV APP_VERSION=${APP_VERSION}
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "node","dist/main.js"]