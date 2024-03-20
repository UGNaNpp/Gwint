FROM node:latest

WORKDIR /app

COPY ./new_server/ /app/

EXPOSE 3000 

RUN npm install

RUN node app.js