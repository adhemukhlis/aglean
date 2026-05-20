import type { RoundToPrecisionOptions } from './types'

function roundToPrecision(value: number, options: RoundToPrecisionOptions = { maxFractionDigits: 2, minFractionDigits: 0, roundingMode: 'halfExpand' }): number {
	if (!Number.isFinite(value)) {
		return value
	}

	const decimalString = new Intl.NumberFormat('en', {
		maximumFractionDigits: options.maxFractionDigits,
		minimumFractionDigits: options.minFractionDigits,
		roundingMode: options.roundingMode,
		style: 'decimal',
		useGrouping: false,
	}).format(value)

	return parseFloat(decimalString)
}

export default roundToPrecision
