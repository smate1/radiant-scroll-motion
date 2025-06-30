import { useCallback, useEffect, useRef, useState } from 'react'

interface ScrollState {
	isAtBottom: boolean
	autoScrollEnabled: boolean
}

interface UseAutoScrollOptions {
	offset?: number
	smooth?: boolean
	content?: React.ReactNode
}

// Mobile detection utility
const isMobileDevice = () => {
	return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	)
}

export function useAutoScroll(options: UseAutoScrollOptions = {}) {
	const { offset = 20, smooth = false, content } = options
	const scrollRef = useRef<HTMLDivElement>(null)
	const lastContentHeight = useRef(0)
	const userHasScrolled = useRef(false)
	const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
	const touchStartY = useRef(0)
	const isTouching = useRef(false)
	const isMobile = isMobileDevice()

	const [scrollState, setScrollState] = useState<ScrollState>({
		isAtBottom: true,
		autoScrollEnabled: true,
	})

	const checkIsAtBottom = useCallback(
		(element: HTMLElement) => {
			const { scrollTop, scrollHeight, clientHeight } = element
			const distanceToBottom = Math.abs(scrollHeight - scrollTop - clientHeight)
			return distanceToBottom <= offset
		},
		[offset]
	)

	const scrollToBottom = useCallback(
		(instant?: boolean) => {
			if (!scrollRef.current) return

			const targetScrollTop =
				scrollRef.current.scrollHeight - scrollRef.current.clientHeight

			if (instant) {
				scrollRef.current.scrollTop = targetScrollTop
			} else {
				scrollRef.current.scrollTo({
					top: targetScrollTop,
					behavior: smooth ? 'smooth' : 'auto',
				})
			}

			setScrollState({
				isAtBottom: true,
				autoScrollEnabled: true,
			})
			userHasScrolled.current = false
		},
		[smooth]
	)

	// Enhanced touch handling for mobile devices
	const handleTouchStart = useCallback((e: TouchEvent) => {
		isTouching.current = true
		touchStartY.current = e.touches[0].clientY
	}, [])

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (!isTouching.current || !scrollRef.current) return

			const currentY = e.touches[0].clientY
			const deltaY = touchStartY.current - currentY

			// Only disable auto-scroll if user is actively scrolling up or significantly down
			if (Math.abs(deltaY) > 10) {
				const atBottom = checkIsAtBottom(scrollRef.current)
				if (!atBottom) {
					userHasScrolled.current = true
					setScrollState(prev => ({
						...prev,
						autoScrollEnabled: false,
					}))
				}
			}
		},
		[checkIsAtBottom]
	)

	const handleTouchEnd = useCallback(() => {
		isTouching.current = false

		// After touch ends, check if we're at bottom and re-enable auto-scroll
		setTimeout(() => {
			if (scrollRef.current) {
				const atBottom = checkIsAtBottom(scrollRef.current)
				if (atBottom) {
					setScrollState(prev => ({
						...prev,
						autoScrollEnabled: true,
					}))
					userHasScrolled.current = false
				}
			}
		}, 200) // Small delay to ensure scroll has settled
	}, [checkIsAtBottom])

	const handleScroll = useCallback(() => {
		if (!scrollRef.current || isTouching.current) return

		// Clear existing timeout to debounce scroll events
		if (scrollTimeout.current) {
			clearTimeout(scrollTimeout.current)
		}

		// Debounce scroll handling for better mobile performance
		scrollTimeout.current = setTimeout(
			() => {
				if (!scrollRef.current) return

				const atBottom = checkIsAtBottom(scrollRef.current)

				setScrollState(prev => ({
					isAtBottom: atBottom,
					// Re-enable auto-scroll if at the bottom
					autoScrollEnabled: atBottom ? true : prev.autoScrollEnabled,
				}))
			},
			isMobile ? 100 : 50
		) // Longer debounce for mobile
	}, [checkIsAtBottom, isMobile])

	useEffect(() => {
		const element = scrollRef.current
		if (!element) return

		// Add scroll listener
		element.addEventListener('scroll', handleScroll, { passive: true })

		// Add enhanced mobile touch listeners
		if (isMobile) {
			element.addEventListener('touchstart', handleTouchStart, {
				passive: true,
			})
			element.addEventListener('touchmove', handleTouchMove, { passive: true })
			element.addEventListener('touchend', handleTouchEnd, { passive: true })
		}

		return () => {
			element.removeEventListener('scroll', handleScroll)
			if (isMobile) {
				element.removeEventListener('touchstart', handleTouchStart)
				element.removeEventListener('touchmove', handleTouchMove)
				element.removeEventListener('touchend', handleTouchEnd)
			}
		}
	}, [
		handleScroll,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
		isMobile,
	])

	useEffect(() => {
		const scrollElement = scrollRef.current
		if (!scrollElement) return

		const currentHeight = scrollElement.scrollHeight
		const hasNewContent = currentHeight !== lastContentHeight.current

		if (hasNewContent) {
			if (scrollState.autoScrollEnabled) {
				requestAnimationFrame(() => {
					scrollToBottom(lastContentHeight.current === 0)
				})
			}
			lastContentHeight.current = currentHeight
		}
	}, [content, scrollState.autoScrollEnabled, scrollToBottom])

	useEffect(() => {
		const element = scrollRef.current
		if (!element) return

		const resizeObserver = new ResizeObserver(() => {
			if (scrollState.autoScrollEnabled) {
				scrollToBottom(true)
			}
		})

		resizeObserver.observe(element)
		return () => resizeObserver.disconnect()
	}, [scrollState.autoScrollEnabled, scrollToBottom])

	const disableAutoScroll = useCallback(() => {
		const atBottom = scrollRef.current
			? checkIsAtBottom(scrollRef.current)
			: false

		// Only disable if not at bottom
		if (!atBottom) {
			userHasScrolled.current = true
			setScrollState(prev => ({
				...prev,
				autoScrollEnabled: false,
			}))
		}
	}, [checkIsAtBottom])

	return {
		scrollRef,
		isAtBottom: scrollState.isAtBottom,
		autoScrollEnabled: scrollState.autoScrollEnabled,
		scrollToBottom: () => scrollToBottom(false),
		disableAutoScroll,
		// Enhanced mobile touch handlers
		handleTouchStart: (e: React.TouchEvent) => handleTouchStart(e.nativeEvent),
		handleTouchMove: (e: React.TouchEvent) => handleTouchMove(e.nativeEvent),
		handleTouchEnd: (e: React.TouchEvent) => handleTouchEnd(),
		isMobileDevice: isMobile,
	}
}
