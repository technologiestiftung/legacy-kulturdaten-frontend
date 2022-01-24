FROM node:16.13.2-alpine3.15

RUN mkdir /app
WORKDIR /app/

COPY package.json package-lock.json ./
RUN npm i

COPY . /app/

RUN npm run build-storybook && \
  mv storybook-static public/storybook

RUN npm run build

RUN addgroup -S kulturdaten-berlin && adduser -S frontend -G kulturdaten-berlin
RUN chown -R frontend:kulturdaten-berlin /app
USER frontend