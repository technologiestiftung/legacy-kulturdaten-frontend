module.exports = {
  publicRuntimeConfig: {
    defaultLocale: 'catchAll',
    api: 'https://alpha.api.kulturdaten-berlin.anyvent.cloud',
    authTokenCookieName: 'AUTH_TOKEN',
  },
  trailingSlash: true,
  i18n: {
    locales: ['de-DE', 'en-DE', 'catchAll'],
    defaultLocale: 'catchAll',
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
