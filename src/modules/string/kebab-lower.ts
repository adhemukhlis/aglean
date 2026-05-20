import sanitizeString from './sanitize-string'
import whitespaceRegex from '../regex/whitespace'

function kebabLower(value: null | string | undefined): string {
	return sanitizeString(value).replace(new RegExp(whitespaceRegex, 'g'), '-').toLowerCase()
}

export default kebabLower
