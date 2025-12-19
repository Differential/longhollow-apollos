module.exports = () => ({
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    [
      '@babel/plugin-proposal-optional-chaining',
      {
        loose: false,
      },
    ],
    [
      '@babel/plugin-proposal-nullish-coalescing-operator',
      {
        loose: false,
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: false,
      },
    ],
    '@babel/plugin-proposal-throw-expressions',
  ],
});
