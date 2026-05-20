export type JSONSafeParseResult<T> = {
	isValid: boolean
	value: null | T
}

export type SanitizeObjectOptions = {
	noEmptyString?: boolean
}
