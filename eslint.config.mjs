import { defineConfig } from 'eslint-define-config'

export default defineConfig({
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    // ⚡ Общие
    'no-console': 'warn',
    'no-unused-vars': 'off', // отключаем стандартное
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // ⚡ React
    'react/prop-types': 'off', // не нужно с TypeScript
    'react/react-in-jsx-scope': 'off', // Next.js 13+ не требует React import
    'react/jsx-uses-react': 'off',

    // ⚡ Импорты
    'import/order': [
      'warn',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
      },
    ],

    // ⚡ Неиспользуемые импорты
    'unused-imports/no-unused-imports': 'warn',
  },
  settings: {
    react: {
      version: 'detect', // автоматически определяет версию React
    },
  },
  ignorePatterns: ['.next/', 'node_modules/', 'out/', 'public/'],
})
