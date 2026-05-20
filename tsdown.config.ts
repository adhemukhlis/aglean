import { defineConfig } from 'tsdown'

export default defineConfig({
	clean: true,
	dts: true,
	entry: {
		array: 'src/modules/array/index.ts',
		common: 'src/modules/common/index.ts',
		crypto: 'src/modules/crypto/index.ts',
		function: 'src/modules/function/index.ts',
		index: 'src/index.ts',
		map: 'src/modules/map/index.ts',
		number: 'src/modules/number/index.ts',
		object: 'src/modules/object/index.ts',
		regex: 'src/modules/regex/index.ts',
		string: 'src/modules/string/index.ts',
		validator: 'src/modules/validator/index.ts',
	},
	format: ['esm'],
	minify: true,
	outDir: 'dist',
	sourcemap: false,
	target: 'es2022',
	treeshake: true,
})
