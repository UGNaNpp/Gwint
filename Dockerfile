FROM node:latest

WORKDIR /app

COPY ./new_server/ /app/

EXPOSE 3000 

CMD ["node", "new_serwer/app.js"]