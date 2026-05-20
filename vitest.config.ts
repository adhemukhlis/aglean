import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		coverage: {
			exclude: ['src/**/*.test.ts', 'src/**/*.d.ts', 'src/**/index.ts', 'src/types.ts'],
			include: ['src/**/*.ts'],
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
		},
		environment: 'node',
		globals: true,
	},
})
