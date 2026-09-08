/**
 * Applies consistent TypeScript and React linting across every workspace package.
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['**/dist/**', '**/node_modules/**'],
  overrides: [
    {
      files: ['apps/client/**/*.{ts,tsx}'],
      plugins: ['react-hooks', 'react-refresh'],
      rules: {
        ...require('eslint-plugin-react-hooks').configs.recommended.rules,
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      },
    },
  ],
};
