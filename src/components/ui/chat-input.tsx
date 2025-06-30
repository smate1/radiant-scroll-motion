import * as React from 'react'
import { cn } from '@/lib/utils'

interface ChatInputProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	onSend?: () => void
	autoFocus?: boolean
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
	({ className, onSend, onKeyDown, autoFocus = false, ...props }, ref) => {
		const internalRef = React.useRef<HTMLTextAreaElement>(null)
		const textareaRef = ref || internalRef

		React.useEffect(() => {
			if (
				autoFocus &&
				textareaRef &&
				'current' in textareaRef &&
				textareaRef.current
			) {
				textareaRef.current.focus()
			}
		}, [autoFocus, textareaRef])

		// Reset height when value is empty
		React.useEffect(() => {
			if (
				textareaRef &&
				'current' in textareaRef &&
				textareaRef.current &&
				(!props.value || props.value === '')
			) {
				textareaRef.current.style.height = 'auto'
				textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
			}
		}, [props.value, textareaRef])

		const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				onSend?.()
			}
			onKeyDown?.(e)
		}

		const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
			const target = e.target as HTMLTextAreaElement
			target.style.height = 'auto'
			// Limit max height on mobile for better UX
			const maxHeight = window.innerWidth < 768 ? 100 : 120
			target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`

			// Правильная обработка onChange
			const changeEvent = {
				...e,
				target: target,
				currentTarget: target,
			} as React.ChangeEvent<HTMLTextAreaElement>

			if (props.onChange) {
				props.onChange(changeEvent)
			}
		}

		return (
			<textarea
				autoComplete='off'
				autoCorrect='off'
				autoCapitalize='sentences'
				spellCheck='true'
				ref={textareaRef}
				name='message'
				onInput={handleInput}
				onKeyDown={handleKeyDown}
				className={cn(
					'min-h-[44px] max-h-[100px] md:max-h-[120px] w-full resize-none border-0 bg-transparent px-3 py-3 md:px-4 text-sm md:text-base text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0',
					// Mobile safe area handling and iOS fixes
					'touch-manipulation',
					// iOS specific styles
					'-webkit-appearance-none appearance-none',
					'focus:!-webkit-transform-none focus:!transform-none',
					className
				)}
				style={{
					fontSize: window.innerWidth < 768 ? '16px' : undefined, // Prevent zoom on iOS
					WebkitUserSelect: 'text',
					userSelect: 'text',
					WebkitTouchCallout: 'default',
				}}
				rows={1}
				inputMode='text'
				enterKeyHint='send'
				{...props}
			/>
		)
	}
)
ChatInput.displayName = 'ChatInput'

export { ChatInput }
