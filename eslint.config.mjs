import babelParser from '@babel/eslint-parser';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import _import from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

function stripWhitespaceGlobals(globalsObject) {
  return Object.fromEntries(Object.entries(globalsObject).filter(([key]) => key.trim() === key));
}

const browserGlobals = stripWhitespaceGlobals(globals.browser);
const nodeGlobals = stripWhitespaceGlobals(globals.node);

export default defineConfig([
  globalIgnores(['src/images/*', '**/*.test.*']),
  {
    files: ['src/**/*.{js,jsx,mjs,cjs}', 'server/**/*.{js,jsx,mjs,cjs}'],
    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/recommended'
      )
    ),

    plugins: {
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        socket: true,
      },

      parser: babelParser,
      ecmaVersion: 2022,
      sourceType: 'module',

      parserOptions: {
        requireConfigFile: false,

        ecmaFeatures: {
          jsx: true,
        },

        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'arrow-body-style': 'warn',
      'array-bracket-spacing': 'warn',
      'arrow-parens': ['warn', 'as-needed'],
      'arrow-spacing': 'warn',
      'brace-style': 'warn',
      'comma-spacing': 'warn',
      'consistent-return': 'error',
      'eol-last': 'warn',
      eqeqeq: 'warn',

      indent: [
        'warn',
        2,
        {
          ignoredNodes: ['TemplateLiteral'],
          SwitchCase: 1,
        },
      ],

      'keyword-spacing': 'warn',
      'linebreak-style': ['error', 'unix'],

      'lines-between-class-members': [
        'warn',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],

      'no-await-in-loop': 'warn',
      'no-cond-assign': 'error',
      'no-constant-condition': 'warn',
      'no-else-return': 'warn',
      'no-empty': 'warn',
      'no-extra-parens': ['warn', 'functions'],
      'no-lonely-if': 'warn',
      'no-mixed-operators': 'warn',

      'no-multiple-empty-lines': [
        'warn',
        {
          max: 2,
          maxEOF: 1,
        },
      ],

      'no-trailing-spaces': 'warn',

      'no-unneeded-ternary': [
        'warn',
        {
          defaultAssignment: false,
        },
      ],

      'no-unreachable': 'warn',
      'no-unused-vars': 'warn',
      'no-useless-concat': 'warn',
      'object-shorthand': 'warn',
      'object-curly-spacing': ['warn', 'always'],

      'padding-line-between-statements': [
        'warn',
        {
          blankLine: 'always',
          prev: 'multiline-block-like',
          next: '*',
        },
      ],

      'prefer-arrow-callback': 'warn',
      'prefer-const': 'warn',

      'prefer-destructuring': [
        'warn',
        {
          object: true,
          array: false,
        },
      ],

      'prefer-object-spread': 'warn',
      'prefer-template': 'warn',

      quotes: [
        'warn',
        'single',
        {
          allowTemplateLiterals: true,
        },
      ],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'rest-spread-spacing': 'warn',
      'semi-style': 'warn',
      'space-before-blocks': 'warn',
      'space-in-parens': 'warn',
      'template-curly-spacing': ['off'],
      'react/prop-types': 'off',
      'react/no-children-prop': 'off',
      'no-case-declarations': 'off',
      'react/react-in-jsx-scope': 'off',
    },

    ignores: ['**/*.test.*', '**/*.spec.*', '**/__tests__/**'],
  },
]);
