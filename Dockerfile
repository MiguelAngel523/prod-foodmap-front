FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM httpd:2.4-alpine

RUN rm -rf /usr/local/apache2/htdocs/*

COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

COPY apache.conf /usr/local/apache2/conf/httpd.conf

EXPOSE 80