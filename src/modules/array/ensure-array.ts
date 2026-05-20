function ensureArray<T>(value: null | T | undefined): T extends unknown[] ? T : Exclude<T, null | undefined>[] {
	return (value === undefined || value === null ? [] : Array.isArray(value) ? value : [value]) as T extends unknown[] ? T : Exclude<T, null | undefined>[]
}

export default ensureArray
