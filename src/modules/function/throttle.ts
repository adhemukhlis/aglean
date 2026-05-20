import type { ThrottledFunction, ThrottleOptions } from './types'

function throttle<Args extends unknown[], R>(func: (this: unknown, ...args: Args) => R, wait: number, options: ThrottleOptions = {}): ThrottledFunction<Args, R> {
	let timeoutId: null | ReturnType<typeof setTimeout> = null
	let lastArgs: Args | undefined
	let lastThis: unknown
	let result: R | undefined
	let lastCallTime = 0
	let lastInvokeTime = 0
	const leading = 'leading' in options ? !!options.leading : true
	const trailing = 'trailing' in options ? !!options.trailing : true

	function invokeFunc(time: number) {
		const args = lastArgs
		const thisArg = lastThis

		lastArgs = undefined
		lastThis = undefined
		lastInvokeTime = time

		if (args) {
			result = func.apply(thisArg, args)
		}

		return result
	}

	function leadingEdge(time: number) {
		lastInvokeTime = time
		timeoutId = setTimeout(timerExpired, wait)

		return leading ? invokeFunc(time) : result
	}

	function remainingWait(time: number) {
		const timeSinceLastCall = time - lastCallTime
		const timeSinceLastInvoke = time - lastInvokeTime
		const timeWaiting = wait - timeSinceLastCall

		return Math.min(timeWaiting, wait - timeSinceLastInvoke)
	}

	function shouldInvoke(time: number) {
		const timeSinceLastCall = time - lastCallTime
		const timeSinceLastInvoke = time - lastInvokeTime

		return lastCallTime === 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || timeSinceLastInvoke >= wait
	}

	function timerExpired() {
		const time = Date.now()

		if (shouldInvoke(time)) {
			return trailingEdge(time)
		}

		// Restart the timer.
		timeoutId = setTimeout(timerExpired, remainingWait(time))
	}

	function trailingEdge(time: number) {
		timeoutId = null

		if (trailing && lastArgs) {
			return invokeFunc(time)
		}

		lastArgs = undefined
		lastThis = undefined

		return result
	}

	function cancel() {
		if (timeoutId !== null) {
			clearTimeout(timeoutId)
		}

		lastInvokeTime = 0
		lastArgs = undefined
		lastCallTime = 0
		lastThis = undefined
		timeoutId = null
	}

	function flush() {
		return timeoutId === null ? result : trailingEdge(Date.now())
	}

	function throttled(this: unknown, ...args: Args) {
		const time = Date.now()
		const isInvoking = shouldInvoke(time)

		lastArgs = args
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		lastThis = this
		lastCallTime = time

		if (isInvoking) {
			if (timeoutId === null) {
				return leadingEdge(lastCallTime)
			}

			// Handle invocations in a tight loop.
			if (timeoutId !== null) {
				clearTimeout(timeoutId)
			}

			timeoutId = setTimeout(timerExpired, wait)

			return invokeFunc(lastCallTime)
		}

		if (timeoutId === null) {
			timeoutId = setTimeout(timerExpired, wait)
		}

		return result
	}

	throttled.cancel = cancel
	throttled.flush = flush

	return throttled as ThrottledFunction<Args, R>
}

export default throttle
