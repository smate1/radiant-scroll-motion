import * as React from 'react'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAutoScroll } from '@/hooks/use-auto-scroll'
import { cn } from '@/lib/utils'

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
	smooth?: boolean
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
	({ className, children, smooth = false, ...props }, _ref) => {
		const {
			scrollRef,
			isAtBottom,
			autoScrollEnabled,
			scrollToBottom,
			disableAutoScroll,
			handleTouchStart,
			handleTouchMove,
			handleTouchEnd,
			isMobileDevice,
		} = useAutoScroll({
			smooth,
			content: children,
		})

		return (
			<div className='relative w-full h-full'>
				<div
					className={cn(
						'flex flex-col w-full h-full px-4 py-6',
						// Unified scroll functionality for all devices
						'overflow-y-auto overflow-x-hidden',
						// Custom scrollbar styling
						'scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent',
						// Enhanced mobile-specific optimizations
						'touch-pan-y',
						// Prevent overscroll bounce but allow internal scrolling
						'overscroll-y-contain',
						// iOS Safari specific fixes
						'[&::-webkit-scrollbar]:w-2',
						'[&::-webkit-scrollbar-track]:bg-transparent',
						'[&::-webkit-scrollbar-thumb]:bg-gray-600',
						'[&::-webkit-scrollbar-thumb]:rounded-full',
						'[&::-webkit-scrollbar-thumb:hover]:bg-gray-500',
						// Mobile optimizations
						'chat-message-list mobile-scroll-optimized',
						className
					)}
					ref={scrollRef}
					onWheel={disableAutoScroll}
					onTouchStart={isMobileDevice ? handleTouchStart : disableAutoScroll}
					onTouchMove={isMobileDevice ? handleTouchMove : disableAutoScroll}
					onTouchEnd={isMobileDevice ? handleTouchEnd : undefined}
					style={{
						// Enhanced mobile scroll performance with momentum
						WebkitOverflowScrolling: 'touch',
						// Disable smooth scrolling for better mobile performance
						scrollBehavior: 'auto',
						// Prevent momentum scrolling from interfering with auto-scroll
						msOverflowStyle: 'scrollbar',
						scrollbarWidth: 'thin',
						// Mobile viewport fixes
						minHeight: '100%',
						maxHeight: '100%',
						// Prevent elastic scrolling on iOS
						overscrollBehaviorY: 'contain',
						// Optimize for touch interaction
						touchAction: 'pan-y',
						// Prevent content shifting
						position: 'relative',
						// Improve scrolling performance
						willChange: 'scroll-position',
					}}
					{...props}
				>
					<div className='flex flex-col space-y-4 min-h-full pb-8'>
						{children}
					</div>
				</div>

				{/* Enhanced scroll-to-bottom button with mobile support */}
				{!isAtBottom && (
					<Button
						onClick={() => {
							scrollToBottom()
						}}
						size='icon'
						variant='outline'
						className='absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 shadow-lg z-10 flex transition-all duration-200 hover:scale-105 active:scale-95'
						aria-label='Scroll to bottom'
					>
						<ArrowDown className='h-4 w-4' />
					</Button>
				)}
			</div>
		)
	}
)

ChatMessageList.displayName = 'ChatMessageList'

export { ChatMessageList }
