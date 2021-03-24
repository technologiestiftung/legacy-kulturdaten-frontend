module.exports = {
  presets: [
    [
      'next/babel',
      {
        '@babel/preset-env': {},
        '@babel/preset-react': { runtime: 'automatic' },
        '@babel/preset-typescript': {},
      },
    ],
  ],
};
