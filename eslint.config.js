import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

/**
 * ESLint v9+ uses Flat Config (eslint.config.js).
 * This file replaces legacy `.eslintrc.*` and `.eslintignore`.
 */
export default [
  {
    ignores: [
      'build/*.js',
      'src/assets',
      'public/*',
      'dist',
      '.eslintrc.*',
      '.husky',
      '.vscode',
      '.agents/**',
      'node_modules',
      'public',
      'commitlint.config.*',
    ],
  },
  // TypeScript rules for .ts/.js files
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      'no-unused-expressions': 'warn',
      'no-console': 'warn',
    },
  },

  // Vue rules + TS in <script setup lang="ts">
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      'no-unused-expressions': 'warn',
      'vue/no-reserved-component-names': 'warn',
      'vue/valid-template-root': 'warn',
      'vue/multi-word-component-names': 'off',
    },
  },
];
