FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
USER root
RUN apk update && apk add curl wscat
COPY --chown=node:node . .
EXPOSE 1234
CMD [ "npm", "start" ]