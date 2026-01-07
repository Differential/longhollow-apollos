module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['import'],
  rules: {
    'arrow-body-style': 0,
    camelcase: 0,
    'class-methods-use-this': 0,
    'default-param-last': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 2,
    'import/extensions': 0,
    'import/first': 0,
    'import/newline-after-import': 0,
    'import/order': 0,
    'import/no-unresolved': [
      'error',
      { ignore: ['^react-native-config$', '^jest-fetch-mock$'] },
    ],
    'import/prefer-default-export': 1,
    'max-classes-per-file': 0,
    'no-promise-executor-return': 0,
    'no-restricted-exports': 0,
    'no-constructor-return': 0,
    'no-unsafe-optional-chaining': 0,
    'no-use-before-define': 0,
    'prefer-promise-reject-errors': 0,
    'prefer-regex-literals': 0,
    'global-require': 0,
    'import/no-cycle': 0,
    'function-paren-newline': 0,
    'no-underscore-dangle': 0,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
      },
    },
  },
  overrides: [
    {
      files: ['**/__tests__/**', '**/*.test.js', '**/*.tests.js'],
      rules: {
        'import/no-unresolved': 0,
      },
    },
  ],
  env: {
    node: true,
  },
};
