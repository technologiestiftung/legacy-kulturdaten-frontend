module.exports = {
  publicRuntimeConfig: {
    defaultLocale: 'catchAll',
    api: 'https://beta.api.kulturdaten.berlin',
    authTokenCookieName: 'AUTH_TOKEN',
  },
  trailingSlash: true,
  i18n: {
    locales: ['de-DE', 'en-DE', 'catchAll'],
    defaultLocale: 'catchAll',
  },
  images: {
    domains: ['beta.api.kulturdaten.berlin', 'api.kulturdaten.berlin']
  },
  async redirects() {
    return [
      {
        source: '/catchAll',
        destination: '/de-DE',
        locale: false,
        permanent: false,
      },
      {
        source: '/catchAll/:slug*/',
        destination: '/de-DE/:slug*/',
        locale: false,
        permanent: false,
      },
    ];
  },
};
