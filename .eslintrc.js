module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-jest', 'plugin:prettier/recommended'],
  rules: {
    'space-before-function-paren': 0,
    'import/export': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    camelcase: [2, { properties: 'always' }],
  },
};
