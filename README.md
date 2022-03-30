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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://mathies.io/"><img src="https://avatars.githubusercontent.com/u/5181384?v=4?s=643" width="643px;" alt=""/><br /><sub><b>Mathies Schneider</b></sub></a><br /><a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=smatjes" title="Code">💻</a> <a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=smatjes" title="Documentation">📖</a></td>
    <td align="center"><a href="https://boris.io/"><img src="https://avatars.githubusercontent.com/u/1102134?v=4?s=643" width="643px;" alt=""/><br /><sub><b>Boris Fruendt</b></sub></a><br /><a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=b0ndt" title="Code">💻</a> <a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=b0ndt" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/matthiasrohmer"><img src="https://avatars.githubusercontent.com/u/12857772?v=4?s=643" width="643px;" alt=""/><br /><sub><b>Matthias Rohmer</b></sub></a><br /><a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=matthiasrohmer" title="Code">💻</a> <a href="https://github.com/technologiestiftung/kulturdaten-frontend/commits?author=matthiasrohmer" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!