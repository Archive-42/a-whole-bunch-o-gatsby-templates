module.exports = {
  root: true,
  env: {
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ['@sentry-internal/sdk'],
  ignorePatterns: ['build/**', 'dist/**', 'esm/**', 'examples/**', 'scripts/**'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      files: ['test/**'],
      env: {
        mocha: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};
