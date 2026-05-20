import sanitizeString from './sanitize-string'
import whitespaceRegex from '../regex/whitespace'

function snakeLower(value: null | string | undefined) {
	return sanitizeString(value).replace(new RegExp(whitespaceRegex, 'g'), '_').toLowerCase()
}

export default snakeLower
