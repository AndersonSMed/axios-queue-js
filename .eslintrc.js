module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-jest'],
  rules: {
    'class-methods-use-this': 0,
    'space-before-function-paren': 0,
    'import/export': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    camelcase: [2, { properties: 'always' }],
  },
};
