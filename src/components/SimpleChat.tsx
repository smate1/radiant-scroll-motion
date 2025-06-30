import React, { useState, useEffect, memo, useRef } from 'react'
import { X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatInput } from '@/components/ui/chat-input'
import { ChatMessageList } from '@/components/ui/chat-message-list'
import {
	ChatBubble,
	ChatBubbleAvatar,
	ChatBubbleMessage,
} from '@/components/ui/chat-bubble'
import { TrafficLight } from '@/components/TrafficLight'
import { useNewChat } from '@/hooks/useNewChat'
import { useSimpleChatContext } from '@/contexts/SimpleChatContext'
import { useTypingActivity } from '@/hooks/useTypingActivity'
import { useMobileChatInput } from '@/hooks/useMobileChatInput'
import { Language } from '@/lib/translations'

interface SimpleChatProps {
	lang: Language
}

const SimpleChat: React.FC<SimpleChatProps> = memo(({ lang }) => {
	const { isChatOpen, closeChat } = useSimpleChatContext()
	const {
		messages,
		isLoading,
		error,
		sendMessage,
		clearError,
		chatId,
		connectionState,
		reconnect,
	} = useNewChat()
	const [inputMessage, setInputMessage] = useState('')
	const [isTrafficLightActive, setIsTrafficLightActive] = useState(false)
	const { isTyping, startTyping } = useTypingActivity(2000)
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const chatContainerRef = useRef<HTMLDivElement>(null)

	// Активируем светофор при печати
	useEffect(() => {
		setIsTrafficLightActive(isTyping)
	}, [isTyping])

	// Логируем изменения сообщений
	useEffect(() => {
		console.log('🔄 Сообщения в SimpleChat обновились:', messages)
		console.log('📊 Количество сообщений:', messages.length)
	}, [messages])

	// Auto scroll to bottom when new messages arrive
	useEffect(() => {
		if (
			chatContainerRef.current &&
			messagesEndRef.current &&
			messages.length > 0
		) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 100)
		}
	}, [messages.length])

	// Also scroll when isLoading changes (for better UX during message sending)
	useEffect(() => {
		if (
			!isLoading &&
			chatContainerRef.current &&
			messagesEndRef.current &&
			messages.length > 0
		) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 50)
		}
	}, [isLoading, messages.length])

	// Block body and html scroll when chat is open
	useEffect(() => {
		if (isChatOpen) {
			// Store original overflow styles
			const originalBodyOverflow = document.body.style.overflow
			const originalHtmlOverflow = document.documentElement.style.overflow

			// Block scroll on both body and html
			document.body.style.overflow = 'hidden'
			document.documentElement.style.overflow = 'hidden'

			// Add class to html for additional control
			document.documentElement.classList.add('chat-open-no-scroll')

			// Cleanup function to restore original overflow
			return () => {
				document.body.style.overflow = originalBodyOverflow
				document.documentElement.style.overflow = originalHtmlOverflow
				document.documentElement.classList.remove('chat-open-no-scroll')
			}
		}
	}, [isChatOpen])

	// Enhanced mobile chat input handling
	const {
		focusInput,
		handleChatAreaClick,
		isMobile,
		isIOS,
		inputVisible,
		focusAttempts,
	} = useMobileChatInput({
		inputRef,
		isChatOpen,
		onFocus: () => {
			console.log('💡 Input focused - mobile optimized')
		},
		onBlur: () => {
			console.log('💡 Input blurred')
		},
	})

	// Emergency recovery mechanism
	useEffect(() => {
		if (!isChatOpen) return

		let recoveryAttempts = 0
		const maxRecoveryAttempts = 5

		const emergencyRecovery = () => {
			if (recoveryAttempts >= maxRecoveryAttempts) return

			const container = document.querySelector(
				'.chat-input-container'
			) as HTMLElement
			const input = inputRef.current

			if (!input || !container) {
				console.warn(
					'🚨 EMERGENCY: Input or container missing, attempting recovery...'
				)
				recoveryAttempts++
				setTimeout(emergencyRecovery, 1000)
				return
			}

			// Check if input is properly accessible
			const rect = input.getBoundingClientRect()
			const isVisible = rect.height > 0 && rect.width > 0
			const isInDocument = document.body.contains(input)
			const hasProperParent = input.closest('.chat-input-container')

			if (!isVisible || !isInDocument || !hasProperParent) {
				console.error(
					'🚨 CRITICAL: Input field lost, executing emergency recovery!'
				)

				// Force emergency classes
				container.classList.add(
					'chat-input-force-visible',
					'chat-input-recovery'
				)
				input.classList.add('chat-input-force-visible')
				input.setAttribute('data-recovery', 'true')

				// Force critical styles
				container.style.cssText =
					'display: block !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 1000 !important; min-height: 60px !important;'

				input.style.cssText =
					'display: block !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 1001 !important; min-height: 48px !important; width: 100% !important; pointer-events: auto !important; background: rgba(31, 41, 55, 1) !important; border: 1px solid #4B5563 !important; border-radius: 8px !important; padding: 12px 16px !important; color: white !important; font-size: 16px !important;'

				// Re-enable input
				input.disabled = false
				input.readOnly = false
				input.removeAttribute('hidden')
				input.tabIndex = 0

				// Force focus
				setTimeout(() => {
					try {
						input.focus()
						console.log('✅ Emergency recovery completed')
					} catch (error) {
						console.error('Emergency focus failed:', error)
					}
				}, 100)

				recoveryAttempts++
			}
		}

		// Run emergency check every 2 seconds
		const recoveryInterval = setInterval(emergencyRecovery, 2000)

		// Initial check after a delay
		setTimeout(emergencyRecovery, 500)

		return () => clearInterval(recoveryInterval)
	}, [isChatOpen, inputRef])

	const handleTrafficLightClick = () => {
		setIsTrafficLightActive(true)
		setTimeout(() => {
			setIsTrafficLightActive(false)
		}, 3000)
	}

	const handleSendMessage = async () => {
		if (!inputMessage.trim() || isLoading) return

		const messageContent = inputMessage.trim()
		console.log('📤 Отправляем сообщение из компонента:', messageContent)
		setInputMessage('')

		// Отправляем сообщение
		await sendMessage(messageContent)

		// Enhanced refocus logic - always refocus after sending
		setTimeout(() => {
			focusInput()
			// Also ensure scroll to bottom after sending
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
			}
		}, 200)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputMessage(e.target.value)
		// Активируем индикатор печати при вводе текста
		if (e.target.value.trim()) {
			startTyping()
		}
	}

	// Connection status indicator
	const getConnectionStatus = () => {
		switch (connectionState.status) {
			case 'connected':
				return { color: 'bg-green-500', text: 'Підключено', icon: '🟢' }
			case 'connecting':
				return {
					color: 'bg-blue-500 animate-pulse',
					text: 'Підключення...',
					icon: '🔵',
				}
			case 'reconnecting':
				return {
					color: 'bg-yellow-500 animate-pulse',
					text: 'Перепідключення...',
					icon: '🟡',
				}
			case 'disconnected':
				return { color: 'bg-red-500', text: 'Відключено', icon: '🔴' }
			case 'error':
				return { color: 'bg-red-600', text: 'Помилка', icon: '❌' }
			default:
				return { color: 'bg-gray-500', text: 'Невідомо', icon: '⚪' }
		}
	}

	const connectionStatus = getConnectionStatus()

	console.log(
		'🎨 Рендер SimpleChat. Сообщений:',
		messages.length,
		'isLoading:',
		isLoading,
		'isMobile:',
		isMobile,
		'isIOS:',
		isIOS
	)

	return (
		<>
			{/* Overlay */}
			<div
				className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-500 ease-in-out ${
					isChatOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
				}`}
				onClick={closeChat}
			/>

			{/* Sidebar */}
			<div
				className={`fixed right-0 top-0 w-full md:w-[600px] lg:w-[700px] bg-gray-900 border-l border-gray-800 z-50 transform transition-all duration-700 ease-in-out chat-container ios-safe-height ${
					isChatOpen
						? 'translate-x-0 opacity-100'
						: 'translate-x-full opacity-0'
				}`}
				onClick={e => handleChatAreaClick(e.nativeEvent)}
				style={{
					height: isIOS ? '-webkit-fill-available' : '100vh',
					paddingTop: isIOS ? 'env(safe-area-inset-top)' : '0',
					paddingBottom: isIOS ? 'env(safe-area-inset-bottom)' : '0',
				}}
			>
				{/* Decorative circles - только на десктопе */}
				<div className='absolute inset-0 overflow-hidden pointer-events-none hidden md:block'>
					<div className='absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-connexi-orange/20 to-connexi-pink/20 blur-xl animate-pulse'></div>
					<div
						className='absolute top-40 right-32 w-24 h-24 rounded-full bg-gradient-to-br from-connexi-pink/15 to-connexi-orange/15 blur-lg animate-pulse'
						style={{ animationDelay: '1s' }}
					></div>
					<div
						className='absolute top-72 right-16 w-16 h-16 rounded-full bg-gradient-to-br from-connexi-orange/25 to-connexi-pink/25 blur-md animate-pulse'
						style={{ animationDelay: '2s' }}
					></div>
				</div>

				{/* Header */}
				<div className='flex items-center justify-between p-3 md:p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm relative z-10'>
					<div className='flex items-center gap-3'>
						<div className='h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden flex items-center justify-center'>
							<img
								src='/lovable-uploads/0602a23b-6fed-48fc-9ed3-ca7c446252a0.png'
								alt='AI Assistant'
								className='h-8 w-8 md:h-10 md:w-10 object-contain'
								loading='lazy'
							/>
						</div>
						<div>
							<div className='flex items-center gap-2'>
								<h2 className='text-base md:text-lg font-semibold text-white'>
									AI-Помічник Connexi
								</h2>
								<span className='px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full'>
									DEMO
								</span>
							</div>
							<p className='text-xs md:text-sm text-white/60'>
								{lang === 'en' ? 'Demo Chat System' : 'Демо система чату'}
							</p>
							<div className='flex items-center gap-2 text-xs text-white/40 hidden md:block'>
								<span>Chat ID: {chatId.substring(0, 16)}...</span>
								<span>•</span>
								<span>Повідомлень: {messages.length}</span>
							</div>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<TrafficLight
							isActive={isTrafficLightActive}
							className='cursor-pointer'
							onClick={handleTrafficLightClick}
						/>

						{/* Enhanced connection status */}
						<div className='flex items-center gap-2'>
							<div
								className={`w-3 h-3 rounded-full ${connectionStatus.color}`}
								title={connectionStatus.text}
							/>
							<span className='text-xs text-white/60 hidden md:inline'>
								{connectionStatus.text}
							</span>

							{/* Manual reconnect button */}
							{(connectionState.status === 'disconnected' ||
								connectionState.status === 'error') && (
								<Button
									variant='ghost'
									size='sm'
									onClick={reconnect}
									className='text-xs text-white/70 hover:text-white hover:bg-gray-800 transition-all duration-200 px-2 py-1 h-auto'
									title='Перепідключитися'
								>
									🔄
								</Button>
							)}
						</div>

						<Button
							variant='ghost'
							size='icon'
							onClick={closeChat}
							className='text-white/70 hover:text-white hover:bg-gray-800 transition-all duration-200 h-8 w-8 md:h-10 md:w-10'
						>
							<X className='h-4 w-4 md:h-5 md:w-5' />
						</Button>
					</div>
				</div>

				{/* Chat Content */}
				<div
					className='flex flex-col relative z-10 ios-safe-height'
					style={{
						height: isIOS ? '-webkit-fill-available' : 'calc(100vh - 100px)',
					}}
				>
					{/* Connection status banner */}
					{(connectionState.status === 'disconnected' ||
						connectionState.status === 'error' ||
						connectionState.status === 'reconnecting') && (
						<div
							className={`px-4 py-2 text-center text-sm border-b border-gray-800 flex-shrink-0 ${
								connectionState.status === 'error'
									? 'bg-red-500/20 text-red-200 border-red-500/30'
									: connectionState.status === 'reconnecting'
									? 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30'
									: 'bg-gray-500/20 text-gray-200 border-gray-500/30'
							}`}
						>
							<div className='flex items-center justify-center gap-2'>
								<span>{connectionStatus.icon}</span>
								<span>
									{connectionState.status === 'disconnected' &&
										"З'єднання втрачено"}
									{connectionState.status === 'error' && "Помилка з'єднання"}
									{connectionState.status === 'reconnecting' &&
										`Перепідключення... (спроба ${connectionState.retryCount})`}
								</span>
								{(connectionState.status === 'disconnected' ||
									connectionState.status === 'error') && (
									<Button
										variant='ghost'
										size='sm'
										onClick={reconnect}
										className='text-xs underline hover:no-underline px-1 py-0 h-auto'
									>
										Перепідключитися
									</Button>
								)}
							</div>
						</div>
					)}

					{/* Messages */}
					<div
						className='flex-1 overflow-hidden chat-message-list chat-clickable-area'
						ref={chatContainerRef}
					>
						<ChatMessageList smooth>
							{messages.length === 0 && (
								<div className='flex items-center justify-center h-full text-gray-400'>
									<div className='text-center'>
										<p className='text-lg mb-2'>👋 Начните диалог</p>
										<p className='text-sm'>
											Отправьте сообщение, чтобы начать...
										</p>
										<p className='text-xs mt-2 opacity-70'>
											Нажмите здесь для ввода сообщения
										</p>
										<div className='flex items-center justify-center gap-2 text-xs mt-2 opacity-50'>
											<span
												className={`w-2 h-2 rounded-full ${connectionStatus.color}`}
											></span>
											<span>{connectionStatus.text}</span>
										</div>
									</div>
								</div>
							)}
							{messages.map(message => (
								<ChatBubble
									key={message.id}
									variant={message.role === 'user' ? 'sent' : 'received'}
								>
									{message.role === 'assistant' && (
										<ChatBubbleAvatar
											src='/lovable-uploads/0602a23b-6fed-48fc-9ed3-ca7c446252a0.png'
											fallback='AI'
											className='border-none outline-none'
										/>
									)}
									<ChatBubbleMessage
										variant={message.role === 'user' ? 'sent' : 'received'}
									>
										{message.content}
									</ChatBubbleMessage>
									{message.role === 'user' && (
										<ChatBubbleAvatar
											fallback={lang === 'en' ? 'You' : 'Ви'}
											className='bg-blue-600 border-none outline-none'
										/>
									)}
								</ChatBubble>
							))}
							{isLoading && (
								<ChatBubble variant='received'>
									<ChatBubbleAvatar
										src='/lovable-uploads/0602a23b-6fed-48fc-9ed3-ca7c446252a0.png'
										fallback='AI'
										className='border-none outline-none'
									/>
									<ChatBubbleMessage variant='received' isLoading />
								</ChatBubble>
							)}
							<div ref={messagesEndRef} />
						</ChatMessageList>
					</div>

					{/* Enhanced Input Section - Always visible and active */}
					<div
						className='p-2 md:p-4 border-t border-gray-800 bg-gray-900 relative chat-input-container flex-shrink-0'
						style={{
							paddingBottom: isIOS
								? 'calc(0.5rem + env(safe-area-inset-bottom))'
								: undefined,
						}}
					>
						{error && (
							<div className='mb-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm flex items-start justify-between'>
								<div className='flex-1'>
									<span>{error}</span>
									{connectionState.status === 'error' && (
										<div className='mt-1'>
											<Button
												variant='ghost'
												size='sm'
												onClick={reconnect}
												className='text-xs text-red-200 hover:text-white underline px-0 py-0 h-auto'
											>
												Спробувати знову
											</Button>
										</div>
									)}
								</div>
								<Button
									variant='ghost'
									size='sm'
									onClick={clearError}
									className='text-red-200 hover:text-white px-1 py-0 h-auto'
								>
									✕
								</Button>
							</div>
						)}

						<div className='flex gap-2 items-end overflow-hidden'>
							<div className='flex-1 bg-gray-800 rounded-lg border border-gray-700 focus-within:border-connexi-orange transition-colors min-h-[48px] relative '>
								<ChatInput
									ref={inputRef}
									placeholder={
										lang === 'en'
											? 'Type your message...'
											: 'Введіть ваше повідомлення...'
									}
									value={inputMessage}
									onChange={handleInputChange}
									onSend={handleSendMessage}
									disabled={
										isLoading || connectionState.status === 'disconnected'
									}
									autoFocus={true}
									className='text-white placeholder:text-gray-400 px-3 py-3 md:px-4 text-sm md:text-base'
								/>

								{/* Loading indicator overlay */}
								{isLoading && (
									<div
										className={`absolute ${
											isMobile
												? 'inset-y-0 right-2 flex items-center'
												: 'inset-0 bg-gray-800/50 flex items-center justify-center'
										} rounded-lg pointer-events-none`}
									>
										<div className='flex items-center gap-2 text-gray-400 text-sm'>
											<div className='w-4 h-4 border-2 border-connexi-orange border-t-transparent rounded-full animate-spin'></div>
											{!isMobile && 'Надсилання...'}
										</div>
									</div>
								)}

								{/* Disconnected overlay */}
								{connectionState.status === 'disconnected' && (
									<div className='absolute inset-0 bg-gray-800/70 flex items-center justify-center rounded-lg pointer-events-none'>
										<div className='flex items-center gap-2 text-gray-400 text-sm'>
											<span>🔴</span>
											Відключено
										</div>
									</div>
								)}
							</div>

							<Button
								onClick={handleSendMessage}
								disabled={
									isLoading ||
									!inputMessage.trim() ||
									connectionState.status === 'disconnected'
								}
								size='icon'
								className='contact-button chat-send-button h-12 w-12 rounded-lg shrink-0 transition-all duration-200 hover:scale-105 active:scale-95'
							>
								<Send
									className={`h-4 w-4 transition-transform duration-200 ${
										isLoading ? 'opacity-50' : ''
									}`}
								/>
							</Button>
						</div>

						{/* Mobile keyboard spacer - iOS safe area handled by CSS */}
						{isIOS && <div className='chat-input-safe-area md:hidden'></div>}
					</div>
				</div>
			</div>
		</>
	)
})

SimpleChat.displayName = 'SimpleChat'

export { SimpleChat }
