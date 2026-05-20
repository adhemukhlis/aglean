export type RoundingMode = 'ceil' | 'expand' | 'floor' | 'halfCeil' | 'halfEven' | 'halfExpand' | 'halfFloor' | 'halfTrunc' | 'trunc'

export type RoundToPrecision = (value: number, options?: RoundToPrecisionOptions) => number

export type RoundToPrecisionOptions = {
	maxFractionDigits?: number
	minFractionDigits?: number
	roundingMode: RoundingMode
}
