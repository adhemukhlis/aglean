import type { FlattenData, FlattenResultStrict } from './types'

function flatten<Target>(header: readonly (keyof Target)[], data: readonly Target[]): FlattenResultStrict<keyof Target>
function flatten<T extends FlattenData, K extends PropertyKey>(header: readonly K[], data: readonly T[]): FlattenResultStrict<K>

function flatten(header: readonly PropertyKey[], data: readonly Record<PropertyKey, unknown>[]) {
	const out: FlattenResultStrict<PropertyKey> = { h: header } as unknown as FlattenResultStrict<PropertyKey>

	for (let i = 0; i < data.length; i++) {
		const d = data[i]
		const row = new Array<unknown>(header.length)

		for (let j = 0; j < header.length; j++) {
			row[j] = (d as Record<PropertyKey, unknown>)[header[j]]
		}

		out[i] = row
	}

	return out
}

export default flatten
