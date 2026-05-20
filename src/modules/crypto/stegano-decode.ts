import decodeFromZeroWidthCharacter from './stegano-decode-from-zero-width-character'
import { splitZeroWidthCharacters } from './utils'

function steganoDecode(text: string, seed: string): { hiddenText: string; originalText: string } {
	const { hiddenText, originalText } = splitZeroWidthCharacters(text)
	const decodedHidden = decodeFromZeroWidthCharacter(hiddenText, seed)

	return { hiddenText: decodedHidden, originalText }
}

export default steganoDecode
