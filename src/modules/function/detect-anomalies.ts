import type { AnomalyResult, DetectionSummary, KeyValueData } from './types'

function detectAnomalies(data: KeyValueData[], threshold: number = 2): DetectionSummary {
	const n = data.length

	if (n === 0) {
		return {
			anomalies: [],
			lowerBound: 0,
			max: 0,
			mean: 0,
			min: 0,
			normals: [],
			results: [],
			stdDev: 0,
			threshold,
			totalAnomalies: 0,
			totalData: 0,
			totalNormal: 0,
			upperBound: 0,
		}
	}

	let mean = 0
	let m2 = 0
	let min = data[0].value
	let max = data[0].value

	for (let i = 0; i < n; i++) {
		const v = data[i].value
		const delta = v - mean

		mean += delta / (i + 1)
		m2 += delta * (v - mean)

		if (v < min) {
			min = v
		}

		if (v > max) {
			max = v
		}
	}

	const stdDev = Math.sqrt(m2 / n)
	const upperBound = mean + threshold * stdDev
	const lowerBound = mean - threshold * stdDev
	const invStdDev = stdDev === 0 ? 0 : 1 / stdDev
	const results = new Array<AnomalyResult>(n)
	const anomalies: AnomalyResult[] = []
	const normals: AnomalyResult[] = []
	let minAnomaly: number | undefined
	let maxAnomaly: number | undefined
	let minNormal: number | undefined
	let maxNormal: number | undefined

	for (let i = 0; i < n; i++) {
		const d = data[i]
		const v = d.value
		const diff = v - mean
		const isAnomaly = v > upperBound || v < lowerBound

		const r: AnomalyResult = {
			deviation: diff < 0 ? -diff : diff,
			isAnomaly,
			key: d.key,
			value: v,
			zScore: diff * invStdDev,
		}

		results[i] = r

		if (isAnomaly) {
			anomalies.push(r)

			if (minAnomaly === undefined || v < minAnomaly) {
				minAnomaly = v
			}

			if (maxAnomaly === undefined || v > maxAnomaly) {
				maxAnomaly = v
			}
		} else {
			normals.push(r)

			if (minNormal === undefined || v < minNormal) {
				minNormal = v
			}

			if (maxNormal === undefined || v > maxNormal) {
				maxNormal = v
			}
		}
	}

	return {
		anomalies,
		lowerBound,
		max,
		maxAnomaly,
		maxNormal,
		mean,
		min,
		minAnomaly,
		minNormal,
		normals,
		results,
		stdDev,
		threshold,
		totalAnomalies: anomalies.length,
		totalData: n,
		totalNormal: normals.length,
		upperBound,
	}
}

export default detectAnomalies
