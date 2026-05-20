import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import pluginImport from 'eslint-plugin-import-x'
import perfectionist from 'eslint-plugin-perfectionist'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

const eslintConfig = defineConfig([
	{
		ignores: ['dist/**', 'node_modules/**', 'coverage/**', '**/*.test.ts'],
	},
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{
		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.node,
				...globals.browser,
			},
			parser: tsEslint.parser,
			parserOptions: {
				project: './tsconfig.eslint.json',
				tsconfigRootDir: import.meta.dirname,
			},
			sourceType: 'module',
		},
	},
	pluginJs.configs.recommended,
	...tsEslint.configs.recommended,
	{
		plugins: {
			'@stylistic': stylistic,
			import: pluginImport,
			perfectionist,
		},
		rules: {
			'@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
			'@stylistic/padding-line-between-statements': [
				'warn',
				{ blankLine: 'always', next: 'return', prev: '*' },
				{ blankLine: 'always', next: '*', prev: 'directive' },
				{ blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
				{ blankLine: 'any', next: ['const', 'let', 'var'], prev: ['const', 'let', 'var'] },
				{ blankLine: 'always', next: '*', prev: 'block-like' },
				{ blankLine: 'always', next: 'block-like', prev: '*' },
				{ blankLine: 'always', next: '*', prev: ['multiline-const'] },
				{ blankLine: 'always', next: ['multiline-const'], prev: '*' },
				{ blankLine: 'always', next: ['if', 'for', 'switch', 'try', 'while'], prev: '*' },
				{ blankLine: 'always', next: '*', prev: ['if', 'for', 'switch', 'try', 'while'] },
				{ blankLine: 'always', next: '*', prev: 'import' },
				{ blankLine: 'any', next: 'import', prev: 'import' },
				{ blankLine: 'always', next: 'export', prev: '*' },
				{ blankLine: 'always', next: ['interface', 'type', 'return'], prev: '*' },
				{ blankLine: 'always', next: '*', prev: ['interface', 'type'] },
			],
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{
					fixStyle: 'separate-type-imports',
					prefer: 'type-imports',
				},
			],
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					ignoreRestSiblings: true,
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/require-await': 'error',
			'arrow-parens': ['error', 'always'],
			curly: ['error', 'all'],
			'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
			'import/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
			'import/no-duplicates': ['error', { 'prefer-inline': false }],
			'import/no-namespace': 'error',
			'import/order': [
				'warn',
				{
					alphabetize: { caseInsensitive: true, order: 'asc' },
					groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], 'type', 'object', 'unknown'],
					'newlines-between': 'always',
					pathGroups: [
						{
							group: 'internal',
							pattern: '@/**',
						},
					],
					pathGroupsExcludedImportTypes: ['type'],
				},
			],
			'no-case-declarations': 'error',
			'no-console': ['warn', { allow: ['warn', 'error', 'info', 'table'] }],
			'no-control-regex': 'off',
			'no-dupe-keys': 'error',
			'no-extra-boolean-cast': 'off',
			'no-misleading-character-class': 'off',
			'no-restricted-syntax': [
				'error',
				{
					message: 'Use function declarations or standard function expressions instead of arrow functions for variable assignments.',
					selector: 'VariableDeclarator > ArrowFunctionExpression',
				},
				{
					message: 'Use method shorthands or standard function expressions instead of arrow functions for object methods.',
					selector: 'Property > ArrowFunctionExpression',
				},
			],
			'no-self-compare': 'error',
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'perfectionist/sort-enums': [
				'warn',
				{
					fallbackSort: { type: 'unsorted' },
					ignoreCase: true,
					order: 'asc',
					sortByValue: 'ifNumericEnum',
					specialCharacters: 'keep',
					type: 'alphabetical',
				},
			],
			'perfectionist/sort-exports': [
				'warn',
				{
					fallbackSort: { type: 'unsorted' },
					ignoreCase: true,
					order: 'asc',
					specialCharacters: 'keep',
					type: 'alphabetical',
				},
			],
			'perfectionist/sort-interfaces': [
				'warn',
				{
					fallbackSort: { type: 'unsorted' },
					ignoreCase: true,
					order: 'asc',
					sortBy: 'name',
					specialCharacters: 'keep',
					type: 'alphabetical',
				},
			],
			'perfectionist/sort-modules': [
				'warn',
				{
					fallbackSort: { type: 'unsorted' },
					groups: [
						'declare-enum',
						'export-enum',
						'enum',
						['declare-interface', 'declare-type'],
						['export-interface', 'export-type'],
						['interface', 'type'],
						'declare-class',
						'class',
						'export-class',
						'declare-function',
						'export-function',
						'function',
					],
					ignoreCase: true,
					newlinesBetweenOverloadSignatures: 'ignore',
					order: 'asc',
					specialCharacters: 'keep',
					type: 'alphabetical',
				},
			],
			'perfectionist/sort-named-exports': [
				'warn',
				{
					fallbackSort: { type: 'unsorted' },
					ignoreAlias: false,
					ignoreCase: true,
					order: 'asc',
					specialCharacters: 'keep',
					type: 'alphabetical',
				},
			],
			'perfectionist/sort-object-types': [
				'warn',
				{
					fallbackSort: { type: 'unsorted' },
					ignoreCase: true,
					order: 'asc',
					sortBy: 'name',
					specialCharacters: 'keep',
					type: 'alphabetical',
				},
			],
			'perfectionist/sort-objects': [
				'warn',
				{
					fallbackSort: { type: 'unsorted' },
					ignoreCase: true,
					order: 'asc',
					sortBy: 'name',
					specialCharacters: 'keep',
					type: 'alphabetical',
				},
			],
			'perfectionist/sort-union-types': [
				'warn',
				{
					fallbackSort: { type: 'unsorted' },
					ignoreCase: true,
					order: 'asc',
					specialCharacters: 'keep',
					type: 'alphabetical',
				},
			],
			'prefer-const': 'error',
			'sort-imports': [
				'warn',
				{
					allowSeparatedGroups: false,
					ignoreCase: true,
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
				},
			],
		},
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.eslint.json',
				},
			},
		},
	},
])

export default eslintConfig
