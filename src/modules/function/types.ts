export type AnomalyResult = {
	deviation: number
	isAnomaly: boolean
	key: string
	value: number
	zScore: number
}

export type DebouncedFunction<Args extends unknown[], R> = {
	(...args: Args): R | undefined
	cancel(): void
	flush(): R | undefined
}

export type DebounceOptions = {
	leading?: boolean
	maxWait?: number
	trailing?: boolean
}

export type DetectionSummary = {
	anomalies: AnomalyResult[]
	lowerBound: number
	max?: number
	maxAnomaly?: number
	maxNormal?: number
	mean: number
	min?: number
	minAnomaly?: number
	minNormal?: number
	normals: AnomalyResult[]
	results: AnomalyResult[]
	stdDev: number
	threshold: number
	totalAnomalies: number
	totalData: number
	totalNormal: number
	upperBound: number
}

export type KeyValueData = {
	key: string
	value: number
}

export type ThrottledFunction<Args extends unknown[], R> = {
	(...args: Args): R | undefined
	cancel(): void
	flush(): R | undefined
}

export type ThrottleOptions = {
	leading?: boolean
	trailing?: boolean
}
