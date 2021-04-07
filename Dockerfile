FROM node:15.14.0-alpine3.13

RUN mkdir /app
WORKDIR /app/

COPY package.json package-lock.json ./
RUN npm i

COPY . /app/

RUN npm run build-storybook && \
  mkdir public && mv storybook-static public/storybook

RUN npm run build

RUN addgroup -S kulturdaten-berlin && adduser -S frontend -G kulturdaten-berlin
RUN chown -R frontend:kulturdaten-berlin /app
USER frontend