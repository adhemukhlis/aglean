import { getKey, toBase64 } from './utils'

import type { CryptoResult } from './types'

const { subtle } = globalThis.crypto

async function encrypt(payload: string, secretKey: string): Promise<CryptoResult> {
	try {
		const key = await getKey(secretKey)
		const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
		const data = new TextEncoder().encode(payload)
		const encrypted = await subtle.encrypt({ iv, name: 'AES-GCM' }, key, data)
		const encryptedBytes = new Uint8Array(encrypted)
		const combined = new Uint8Array(iv.length + encryptedBytes.length)

		combined.set(iv)
		combined.set(encryptedBytes, iv.length)

		return {
			isSuccess: true,
			message: 'Encryption successful',
			result: toBase64(combined),
		}
	} catch (e: unknown) {
		return {
			isSuccess: false,
			message: e instanceof Error ? e.message : 'Encryption failed',
			result: null,
		}
	}
}

export default encrypt
