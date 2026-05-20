import { generalCharsRegex } from '../regex'

function isValidPasswordFormat(password: string): boolean {
	if (password.trim() !== password) {
		return false
	}

	return generalCharsRegex.test(password)
}

export default isValidPasswordFormat
