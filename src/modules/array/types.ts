export type Flatten = {
	<Target>(header: readonly (keyof Target)[], data: readonly Target[]): FlattenResultStrict<keyof Target>
	<T extends FlattenData, K extends PropertyKey>(header: readonly K[], data: readonly T[]): FlattenResultStrict<K>
}

export type FlattenData = Record<string, unknown>

export type FlattenResult = { h: readonly string[] } & Record<number, unknown[]>

export type FlattenResultStrict<K extends PropertyKey> = { h: readonly K[] | string[] } & Record<number, unknown[]>

export type Unflatten = <Target = void, K extends PropertyKey = [Target] extends [void] ? string : keyof Target>(
	payload: FlattenResult | FlattenResultStrict<K>,
) => [Target] extends [void] ? Array<Record<K, unknown>> : Target[]
