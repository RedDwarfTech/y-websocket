FROM node:16-bullseye-slim

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER root
RUN npm install && npm install npx
# RUN apk update && apk add curl websocat
COPY --chown=node:node . .
COPY ./scripts/startup-app.sh /home/node/app
EXPOSE 1234
EXPOSE 3000
CMD ["sh","./startup-app.sh"]