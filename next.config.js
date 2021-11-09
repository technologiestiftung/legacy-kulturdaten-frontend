module.exports = {
  publicRuntimeConfig: {
    defaultLocale: 'catchAll',
    api: process.env.API_BASE_URL || 'https://api.kulturdaten.berlin',
    authTokenCookieName: 'AUTH_TOKEN',
    activeOrganizerCookieName: 'ACTIVE_ORGANIZER_ID',
  },
  trailingSlash: true,
  i18n: {
    locales: ['de-DE', 'en-DE', 'catchAll'],
    defaultLocale: 'catchAll',
  },
  images: {
    domains: ['beta.api.kulturdaten.berlin', 'api.kulturdaten.berlin'],
  },
  typescript: {
    ignoreBuildErrors: true,
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
      {
        source: '/',
        destination: '/auth/login/',
        permanent: false,
      },
      {
        source: '/:organizer/',
        destination: '/:organizer/dashboard/',
        permanent: true,
      },
      {
        source: '/:organizer/profile/',
        destination: '/:organizer/profile/info/',
        permanent: true,
      },
      {
        source: '/',
        destination: '/default/dashboard/',
        permanent: true,
      },
      {
        source: '/default/profile/:sub*',
        destination: '/default/dashboard/',
        permanent: false,
      },
      {
        source: '/default/offer/',
        destination: '/default/dashboard/',
        permanent: false,
      },
      {
        source: '/default/location/',
        destination: '/default/dashboard/',
        permanent: false,
      },
      {
        source: '/default/location/:id*/',
        destination: '/default/dashboard/',
        permanent: false,
      },
      {
        source: '/default/offer/:id*/',
        destination: '/default/dashboard/',
        permanent: false,
      },
      {
        source: '/default/:category*/:id*/create',
        destination: '/default/dashboard/',
        permanent: false,
      },
      {
        source: '/default/location/:id*/:sub*',
        destination: '/default/dashboard/',
        permanent: false,
      },
      {
        source: '/default/offer/:id*/:sub*',
        destination: '/default/dashboard/',
        permanent: false,
      },
    ];
  },
};
