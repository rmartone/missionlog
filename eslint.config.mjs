import { fileURLToPath } from 'url';
import { dirname } from 'path';

import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import typescriptParser from '@typescript-eslint/parser';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    files: ['**/src/**/*.ts', '**/src/**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        sourceType: 'module',
        tsconfigRootDir: __dirname, // Ensures ESLint finds tsconfig.json
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'prettier': prettierPlugin,
    },
    rules: {
      // TypeScript Rules
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrorsIgnorePattern: '^err(or)?$',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Prettier Integration
      'prettier/prettier': 'warn',
    },
  },
];
