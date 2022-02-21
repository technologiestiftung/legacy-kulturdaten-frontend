module.exports = {
  publicRuntimeConfig: {
    defaultLocale: 'catchAll',
    api: 'https://kulturdaten-api.1k5jj15lgph0k.eu-central-1.cs.amazonlightsail.com',
    authTokenCookieName: 'AUTH_TOKEN',
    activeOrganizerCookieName: 'ACTIVE_ORGANIZER_ID',
    adminOrganizerCookieName: 'ADMIN_ORGANIZER_ID',
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
  experimental: {
    esmExternals: false,
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
