import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import vueParser from 'vue-eslint-parser';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    // Prettier 负责格式化；ESLint 负责代码质量。
    prettierConfig,
    {
        ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
    },

    {
        ...js.configs.recommended,
        languageOptions: {
            ...js.configs.recommended.languageOptions,
            globals: {
                ...js.configs.recommended.languageOptions?.globals,
                document: 'readonly',
                window: 'readonly',
            },
        },
    },

    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-undef': 'off',
            'prettier/prettier': 'warn',
        },
    },

    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                parser: tsParser,
                extraFileExtensions: ['.vue'],
            },
            globals: {
                document: 'readonly',
                window: 'readonly',
            },
        },
        plugins: {
            vue: vuePlugin,
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...vuePlugin.configs.recommended.rules,
            'vue/multi-word-component-names': 'off',
            'no-undef': 'off',
            'prettier/prettier': 'warn',
        },
    },
];
