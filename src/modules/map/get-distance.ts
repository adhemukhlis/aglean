import type { CoordinateObject, DistanceUnit } from './types'

// Earth ellipsoid constants (WGS-84)
const WGS84 = {
	flattening: 1 / 298.257223563,
	// semiMajorAxis: 6378137, // equatorial radius (m)
	semiMinorAxis: 6356752.314245, // polar radius (m)
	// Precomputed: (a²−b²)/b² — used in series expansion, avoids per-call recomputation
	uSquared: (6378137 ** 2 - 6356752.314245 ** 2) / 6356752.314245 ** 2,
} as const

type IterationInput = ReducedLatitudes & {
	flattening: number
	lonDiffRad: number
}

type ReducedLatitudes = {
	cosLat1: number
	cosLat2: number
	sinLat1: number
	sinLat2: number
}

type VincentyDistanceInput = VincentyIterationResult & {
	semiMinorAxis: number
	uSquared: number
}

type VincentyIterationResult = {
	angularDistance: number
	cosAngular: number
	cosSquaredAzimuth: number
	midpointCos: number
	sinAngular: number
	sinSquaredAngular: number // avoids recomputing sinAngular**2 in distance step
}

const UNIT_CONVERSIONS: Record<DistanceUnit, number> = {
	km: 1e-3,
	m: 1,
	mi: 1 / 1609.344,
	nm: 1 / 1852,
}

function computeReducedLatitudes(lat1: number, lat2: number, flattening: number): ReducedLatitudes {
	const f1 = 1 - flattening
	const reducedLat1 = Math.atan(f1 * Math.tan(toRad(lat1)))
	const reducedLat2 = Math.atan(f1 * Math.tan(toRad(lat2)))

	return {
		cosLat1: Math.cos(reducedLat1),
		cosLat2: Math.cos(reducedLat2),
		sinLat1: Math.sin(reducedLat1),
		sinLat2: Math.sin(reducedLat2),
	}
}

function computeVincentyDistance({
	angularDistance,
	cosAngular,
	cosSquaredAzimuth,
	midpointCos,
	semiMinorAxis,
	sinAngular,
	sinSquaredAngular,
	uSquared,
}: VincentyDistanceInput): number {
	const ellipsoidCorrection = cosSquaredAzimuth * uSquared
	const seriesA = 1 + (ellipsoidCorrection / 16384) * (4096 + ellipsoidCorrection * (-768 + ellipsoidCorrection * (320 - 175 * ellipsoidCorrection)))
	const seriesB = (ellipsoidCorrection / 1024) * (256 + ellipsoidCorrection * (-128 + ellipsoidCorrection * (74 - 47 * ellipsoidCorrection)))
	const midpointCosSquared = midpointCos ** 2 // cached: used twice

	const angularDistanceCorrection =
		seriesB *
		sinAngular *
		(midpointCos + (seriesB / 4) * (cosAngular * (-1 + 2 * midpointCosSquared) - (seriesB / 6) * midpointCos * (-3 + 4 * sinSquaredAngular) * (-3 + 4 * midpointCosSquared)))

	return semiMinorAxis * seriesA * (angularDistance - angularDistanceCorrection)
}

function getDistance(startCoordinate: CoordinateObject, endCoordinate: CoordinateObject, unit: DistanceUnit = 'm'): number {
	validateCoordinates(startCoordinate, endCoordinate)

	if (startCoordinate.latitude === endCoordinate.latitude && startCoordinate.longitude === endCoordinate.longitude) {
		return 0
	}

	const { flattening, semiMinorAxis, uSquared } = WGS84
	const lonDiffRad = toRad(endCoordinate.longitude) - toRad(startCoordinate.longitude)
	const reducedLatitudes = computeReducedLatitudes(startCoordinate.latitude, endCoordinate.latitude, flattening)
	const vincentyParams = iterateLongitudeDifference({ ...reducedLatitudes, flattening, lonDiffRad })
	const distanceInMeters = computeVincentyDistance({ ...vincentyParams, semiMinorAxis, uSquared })

	return distanceInMeters * UNIT_CONVERSIONS[unit]
}

function iterateLongitudeDifference({ cosLat1, cosLat2, flattening, lonDiffRad, sinLat1, sinLat2 }: IterationInput): VincentyIterationResult {
	let longitudeDiff = lonDiffRad
	let sinLonDiff: number, cosLonDiff: number
	let angularDistance: number, sinAngular: number, sinSquaredAngular: number, cosAngular: number
	let cosSquaredAzimuth: number
	let midpointCos: number, seriesExpansion: number
	let iterations = 0
	let converged = false

	do {
		sinLonDiff = Math.sin(longitudeDiff)
		cosLonDiff = Math.cos(longitudeDiff)
		const term1 = cosLat2 * sinLonDiff
		const term2 = cosLat1 * sinLat2 - sinLat1 * cosLat2 * cosLonDiff

		// sinAngular² = term1² + term2² is already available — avoids a redundant **2 later
		sinSquaredAngular = term1 ** 2 + term2 ** 2
		sinAngular = Math.sqrt(sinSquaredAngular)
		cosAngular = sinLat1 * sinLat2 + cosLat1 * cosLat2 * cosLonDiff
		angularDistance = Math.atan2(sinAngular, cosAngular)
		const sinAzimuth = sinAngular === 0 ? 0 : (cosLat1 * cosLat2 * sinLonDiff) / sinAngular

		cosSquaredAzimuth = 1 - sinAzimuth ** 2
		midpointCos = cosSquaredAzimuth === 0 ? 0 : cosAngular - (2 * sinLat1 * sinLat2) / cosSquaredAzimuth
		seriesExpansion = (flattening / 16) * cosSquaredAzimuth * (4 + flattening * (4 - 3 * cosSquaredAzimuth))
		const prevLongitudeDiff = longitudeDiff
		const midpointCosSquared = midpointCos ** 2 // cached: used twice below

		longitudeDiff =
			lonDiffRad +
			(1 - seriesExpansion) * flattening * sinAzimuth * (angularDistance + seriesExpansion * sinAngular * (midpointCos + seriesExpansion * cosAngular * (-1 + 2 * midpointCosSquared)))

		if (Math.abs(longitudeDiff - prevLongitudeDiff) <= 1e-12) {
			converged = true
			break
		}
	} while (++iterations < 100)

	// Vincenty fails to converge for near-antipodal points — surface distance is
	// still well-defined (~πb ≈ 20,003 km), but the iterative solution is degenerate.
	if (!converged) {
		throw new Error('Vincenty formula gagal konvergen: titik mendekati antipodal. ' + 'Gunakan Haversine atau metode lain untuk pasangan koordinat ini.')
	}

	return { angularDistance, cosAngular, cosSquaredAzimuth, midpointCos, sinAngular, sinSquaredAngular }
}

function toRad(deg: number): number {
	return (deg * Math.PI) / 180
}

function validateCoordinates(startCoordinate: CoordinateObject, endCoordinate: CoordinateObject): void {
	if (startCoordinate.latitude < -90 || startCoordinate.latitude > 90 || endCoordinate.latitude < -90 || endCoordinate.latitude > 90) {
		throw new RangeError('Latitude harus antara -90 dan 90')
	}

	if (startCoordinate.longitude < -180 || startCoordinate.longitude > 180 || endCoordinate.longitude < -180 || endCoordinate.longitude > 180) {
		throw new RangeError('Longitude harus antara -180 dan 180')
	}
}

export default getDistance
