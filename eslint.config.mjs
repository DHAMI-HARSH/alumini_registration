import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';

// 👉 ADD THESE
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  {
    languageOptions: {
      parser: typescriptParser, // 👈 required
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin // 👈 required
    }
  },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        }
      ],

      // React/Next.js rules
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-key': 'error',

      // Best practices
      'no-console': 'warn',
      'no-debugger': 'error'
    }
  },
  {
    // Optional: Restrict rules only to TS files
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: true
      }
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/interface-name-prefix': 'off'
    }
  }
];
