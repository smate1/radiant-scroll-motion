import { useEffect, useCallback, useRef, useState } from 'react'

interface MobileChatInputOptions {
	inputRef: React.RefObject<HTMLTextAreaElement>
	isChatOpen: boolean
	onFocus?: () => void
	onBlur?: () => void
}

export function useMobileChatInput({
	inputRef,
	isChatOpen,
	onFocus,
	onBlur,
}: MobileChatInputOptions) {
	const isIOS = useRef(false)
	const isMobile = useRef(false)
	const originalViewportHeight = useRef(0)
	const [inputVisible, setInputVisible] = useState(true)
	const [lastFocusTime, setLastFocusTime] = useState(0)
	const focusAttemptRef = useRef(0)
	const recoveryIntervalRef = useRef<NodeJS.Timeout>()

	// Detect mobile and iOS
	useEffect(() => {
		const userAgent = navigator.userAgent
		isMobile.current =
			/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
		isIOS.current = /iPad|iPhone|iPod/.test(userAgent)
		originalViewportHeight.current =
			window.visualViewport?.height || window.innerHeight
	}, [])

	// Force input to always be visible and accessible
	useEffect(() => {
		if (!inputRef.current) return

		const input = inputRef.current

		// Ensure input is always visible
		const ensureVisibility = () => {
			if (input) {
				// Force visibility styles
				input.style.display = 'block'
				input.style.visibility = 'visible'
				input.style.opacity = '1'
				input.style.pointerEvents = 'auto'
				input.style.position = 'relative'
				input.style.zIndex = '1'

				// Ensure parent container is also visible
				const container = input.closest('.chat-input-container')
				if (container) {
					const containerEl = container as HTMLElement
					containerEl.style.display = 'block'
					containerEl.style.visibility = 'visible'
					containerEl.style.opacity = '1'
				}

				setInputVisible(true)
			}
		}

		ensureVisibility()

		// Set up mutation observer to watch for unwanted changes
		const observer = new MutationObserver(() => {
			ensureVisibility()
		})

		observer.observe(input, {
			attributes: true,
			attributeFilter: ['style', 'class', 'hidden', 'disabled'],
		})

		// Also observe parent container
		const container = input.closest('.chat-input-container')
		if (container) {
			observer.observe(container, {
				attributes: true,
				attributeFilter: ['style', 'class', 'hidden'],
			})
		}

		return () => observer.disconnect()
	}, [inputRef])

	// Enhanced focus function with multiple fallbacks
	const focusInput = useCallback(() => {
		if (!inputRef.current) return

		const currentTime = Date.now()
		const timeSinceLastFocus = currentTime - lastFocusTime

		// Prevent too frequent focus attempts
		if (timeSinceLastFocus < 100) return

		setLastFocusTime(currentTime)
		focusAttemptRef.current += 1

		const element = inputRef.current

		// Multiple focus strategies
		const attemptFocus = (attempt: number = 0) => {
			if (!element || attempt > 5) return

			try {
				// Strategy 1: Direct focus
				if (attempt === 0) {
					element.focus()
					if (document.activeElement === element) {
						onFocus?.()
						return
					}
				}

				// Strategy 2: Click then focus
				if (attempt === 1) {
					element.click()
					setTimeout(() => element.focus(), 10)
					if (document.activeElement === element) {
						onFocus?.()
						return
					}
				}

				// Strategy 3: Scroll into view then focus
				if (attempt === 2) {
					element.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'nearest',
					})
					setTimeout(() => {
						element.focus()
						if (isIOS.current) element.click()
					}, 150)
					if (document.activeElement === element) {
						onFocus?.()
						return
					}
				}

				// Strategy 4: Force focus with selection
				if (attempt === 3) {
					element.focus()
					element.select()
					if (document.activeElement === element) {
						onFocus?.()
						return
					}
				}

				// Strategy 5: Recreate focus event
				if (attempt === 4) {
					const focusEvent = new FocusEvent('focus', { bubbles: true })
					element.dispatchEvent(focusEvent)
					element.focus()
					if (document.activeElement === element) {
						onFocus?.()
						return
					}
				}

				// Strategy 6: Last resort - force with timeout
				if (attempt === 5) {
					setTimeout(() => {
						element.focus()
						element.click()
						onFocus?.()
					}, 300)
					return
				}

				// Try next strategy
				setTimeout(() => attemptFocus(attempt + 1), 50)
			} catch (error) {
				console.warn('Focus attempt failed:', error)
				setTimeout(() => attemptFocus(attempt + 1), 100)
			}
		}

		attemptFocus()
	}, [inputRef, onFocus, lastFocusTime])

	// Recovery mechanism to ensure input never gets lost
	useEffect(() => {
		if (!isChatOpen) return

		// Clear any existing recovery interval
		if (recoveryIntervalRef.current) {
			clearInterval(recoveryIntervalRef.current)
		}

		// Set up recovery interval
		recoveryIntervalRef.current = setInterval(() => {
			if (inputRef.current) {
				const input = inputRef.current

				// Check if input is properly visible and accessible
				const isHidden =
					input.style.display === 'none' ||
					input.style.visibility === 'hidden' ||
					input.style.opacity === '0' ||
					input.hasAttribute('hidden') ||
					input.disabled

				const isOffscreen =
					input.offsetParent === null && input.style.position !== 'fixed'

				if (isHidden || isOffscreen) {
					console.warn('🚨 Input field detected as hidden/lost, recovering...')

					// Force recovery
					input.style.display = 'block'
					input.style.visibility = 'visible'
					input.style.opacity = '1'
					input.style.pointerEvents = 'auto'
					input.removeAttribute('hidden')
					input.disabled = false

					setInputVisible(true)

					// Try to refocus if needed
					setTimeout(() => {
						if (document.activeElement !== input) {
							focusInput()
						}
					}, 100)
				}
			}
		}, 1000) // Check every second

		return () => {
			if (recoveryIntervalRef.current) {
				clearInterval(recoveryIntervalRef.current)
			}
		}
	}, [isChatOpen, inputRef, focusInput])

	// Handle keyboard show/hide on mobile with stability checks
	useEffect(() => {
		if (!isMobile.current || !window.visualViewport) return

		const handleViewportChange = () => {
			const currentHeight = window.visualViewport.height
			const diff = originalViewportHeight.current - currentHeight

			// Keyboard is likely open if viewport height decreased significantly
			if (diff > 150) {
				// Keyboard opened - ensure input remains focused and visible
				if (inputRef.current) {
					const input = inputRef.current

					// Force visibility
					input.style.display = 'block'
					input.style.visibility = 'visible'
					input.style.opacity = '1'

					// Ensure focus if not already focused
					if (document.activeElement !== input) {
						setTimeout(() => focusInput(), 100)
					}
				}
			}
		}

		window.visualViewport.addEventListener('resize', handleViewportChange)
		return () => {
			window.visualViewport?.removeEventListener('resize', handleViewportChange)
		}
	}, [inputRef, focusInput])

	// Enhanced chat area click handler with force focus
	const handleChatAreaClick = useCallback(
		(e: Event) => {
			const target = e.target as HTMLElement

			// More aggressive click detection
			const clickableAreas = [
				'.chat-message-list',
				'.chat-bubble',
				'.chat-clickable-area',
				'.ChatMessageList',
				'[data-chat-area]',
			]

			const isClickableArea = clickableAreas.some(
				selector => target.closest(selector) || target.matches(selector)
			)

			if (isClickableArea) {
				e.preventDefault()
				e.stopPropagation()

				// Force focus with multiple attempts
				setTimeout(() => focusInput(), 0)
				setTimeout(() => focusInput(), 50)
				setTimeout(() => focusInput(), 150)
			}
		},
		[focusInput]
	)

	// Auto-focus when chat opens with persistence
	useEffect(() => {
		if (isChatOpen) {
			// Multiple focus attempts with increasing delays
			const focusTimeouts = [100, 300, 500, 1000, 2000]

			focusTimeouts.forEach(delay => {
				setTimeout(() => {
					if (inputRef.current && document.activeElement !== inputRef.current) {
						focusInput()
					}
				}, delay)
			})
		}
	}, [isChatOpen, focusInput, inputRef])

	// Listen for custom refocus events with error handling
	useEffect(() => {
		const handleRefocus = () => {
			try {
				focusInput()
			} catch (error) {
				console.warn('Refocus event failed:', error)
				// Retry after a delay
				setTimeout(() => {
					try {
						focusInput()
					} catch (retryError) {
						console.error('Refocus retry failed:', retryError)
					}
				}, 200)
			}
		}

		// Listen to multiple event types
		const events = ['chat-input-refocus', 'chat-focus', 'input-focus']
		events.forEach(event => {
			window.addEventListener(event, handleRefocus)
		})

		return () => {
			events.forEach(event => {
				window.removeEventListener(event, handleRefocus)
			})
		}
	}, [focusInput])

	// Handle blur events with recovery
	const handleBlur = useCallback(() => {
		onBlur?.()

		// Auto-refocus after a short delay if chat is still open
		if (isChatOpen) {
			setTimeout(() => {
				if (inputRef.current && document.activeElement !== inputRef.current) {
					focusInput()
				}
			}, 100)
		}
	}, [onBlur, isChatOpen, inputRef, focusInput])

	// Force input to always be enabled and responsive
	useEffect(() => {
		if (!inputRef.current) return

		const input = inputRef.current

		const forceEnabled = () => {
			input.disabled = false
			input.readOnly = false
			input.style.pointerEvents = 'auto'
			input.style.userSelect = 'text'
			input.tabIndex = 0
		}

		forceEnabled()

		// Re-apply every few seconds as a safety measure
		const enableInterval = setInterval(forceEnabled, 2000)

		return () => clearInterval(enableInterval)
	}, [inputRef])

	return {
		focusInput,
		handleChatAreaClick,
		handleBlur,
		isMobile: isMobile.current,
		isIOS: isIOS.current,
		inputVisible,
		focusAttempts: focusAttemptRef.current,
	}
}
