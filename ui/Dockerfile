FROM node:14-alpine as develop-stage
WORKDIR /app

# Install app dependencies
COPY package*.json /app
RUN yarn global add @quasar/cli
RUN yarn

EXPOSE 8080

WORKDIR /app/ui

CMD ["yarn", "dev"]
