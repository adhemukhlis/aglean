// scripts/gen-exports.ts
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, posix } from 'node:path'

type ExportMap = Record<string, ExportTarget>

type ExportTarget = {
	default: string
	import: string
	types: string
}

/**
 * Generate package.json "exports" map based on dist directory content.
 * - index -> "."
 * - other entries -> "./<name>"
 * - requires dist/<name>.mjs and dist/<name>.d.mts to exist (otherwise skipped)
 */
export function generateExports(distDir = 'dist'): { exports: ExportMap } {
	const absDist = join(process.cwd(), distDir)
	const files = readdirSync(absDist)
	// collect base names from .mjs files only (your desired output uses .mjs)
	const jsBases = files.filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -'.mjs'.length))

	const bases = unique(jsBases).sort((a, b) => {
		if (a === 'index') {
			return -1
		}

		if (b === 'index') {
			return 1
		}

		return a.localeCompare(b)
	})

	const exportsMap: ExportMap = {}

	for (const base of bases) {
		const jsPath = join(absDist, `${base}.mjs`)
		const dtsPath = join(absDist, `${base}.d.mts`)

		if (!isFile(jsPath)) {
			continue
		}

		if (!isFile(dtsPath)) {
			continue
		}

		const key = base === 'index' ? '.' : `./${base}`
		// Use POSIX paths for package.json (always forward slashes)
		const jsRel = posix.join('.', distDir, `${base}.mjs`)
		const dtsRel = posix.join('.', distDir, `${base}.d.mts`)

		exportsMap[key] = {
			default: `./${jsRel}`,
			import: `./${jsRel}`,
			types: `./${dtsRel}`,
		}
	}

	return { exports: exportsMap }
}

function isFile(path: string): boolean {
	try {
		return statSync(path).isFile()
	} catch {
		return false
	}
}

function unique<T>(arr: T[]): T[] {
	return Array.from(new Set(arr))
}

// If run directly: update package.json
if (import.meta.url === new URL(`file://${process.argv[1]}`).href) {
	const distDir = process.argv[2] ?? 'dist'
	const out = generateExports(distDir)
	const pkgPath = join(process.cwd(), 'package.json')
	const pkgContent = readFileSync(pkgPath, 'utf-8')
	const pkg = JSON.parse(pkgContent)

	pkg.exports = out.exports
	writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
	console.info('Successfully updated exports in package.json')
}
