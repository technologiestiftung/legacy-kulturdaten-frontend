![](https://img.shields.io/badge/Build%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiesitftung%20Berlin-blue) ![Beta](https://github.com/technologiestiftung/kulturdaten-api/workflows/Deploy%3A%20Beta/badge.svg) ![Live](https://github.com/technologiestiftung/kulturdaten-api/workflows/Deploy%3A%20Live/badge.svg)

# Kulturdaten.Berlin Frontend

The frontend for the Kulturdaten.Berlin API.

## Developing

To develop locally clone this repository and install all dependencies:

```sh
npm install
```

### Next.js

We use Next.js (React SSR framework) for our frontend. To run it for developing purposes run this command:

```sh
npm run dev # runs Next.js in dev mode on port 3000
```

Dev mode takes care of hot reloading etc.

### Storybook

We build our components as encapsulated functional React components. For development and testing ease we use Storybook.

To run Storybook run:

```sh
npm run storybook # runs Storybook on port 6006
```

## Building

For building clone this repository and install all dependencies:

```sh
npm install
```

### Next.js

To build and run a production version of our frontend run:

```sh
npm run build # builds a production optimized version
npm start # runs Next.js in prod mode on port 3000
```

### Storybook

To build a static version of our Storybook instance run:

```sh
npm run build-storybook # outputs to /storybook-static
```
