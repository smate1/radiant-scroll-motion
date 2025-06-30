import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface ChatMessage {
	id: string
	content: string
	role: 'user' | 'assistant'
	timestamp: Date
}

interface ConnectionState {
	status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error'
	lastConnected: Date | null
	retryCount: number
}

const MAX_RETRY_ATTEMPTS = 5
const RETRY_DELAY_BASE = 1000 // 1 second base delay
const SESSION_STORAGE_KEY = 'conexy_chat_session'
const HEARTBEAT_INTERVAL = 30000 // 30 seconds
const CONNECTION_TIMEOUT = 10000 // 10 seconds

// Mock AI responses for demo
const mockResponses = [
	'Дякую за ваше повідомлення! Я AI-асистент Connexi і готовий допомогти вам.',
	'Це дуже цікаве питання! Дайте мені момент подумати над відповіддю.',
	'Я розумію вашу проблему. Ось що я можу запропонувати...',
	'Чудово! Я радий, що можу вам допомогти з цим питанням.',
	'Давайте розглянемо цю ситуацію детальніше. Що саме вас цікавить?',
	'Це типова задача, з якою ми часто стикаємося. Ось рішення...',
	'Дякую за довіру! Я постараюся дати найкращу відповідь.',
	'Ваше питання дуже актуальне. Ось що я рекомендую...',
]

const getMockResponse = (userMessage: string): string => {
	// Simple logic to generate more relevant responses
	const message = userMessage.toLowerCase()

	if (message.includes('привіт') || message.includes('здравствуй')) {
		return 'Привіт! Я AI-асистент Connexi. Як справи? Чим можу допомогти?'
	}

	if (message.includes('як справи') || message.includes('як дела')) {
		return 'Дякую, що питаєте! У мене все чудово. Готовий допомогти вам із будь-якими питаннями про наші послуги.'
	}

	if (message.includes('допоможи') || message.includes('допомога')) {
		return 'Звісно! Я тут, щоб допомогти. Розкажіть детальніше, що саме вас цікавить?'
	}

	if (
		message.includes('ціна') ||
		message.includes('вартість') ||
		message.includes('скільки')
	) {
		return 'Щодо ціноутворення - у нас дуже гнучкі тарифи. Можу підготувати персональну пропозицію. Розкажіть про ваш проект?'
	}

	if (
		message.includes('контакт') ||
		message.includes('телефон') ||
		message.includes('email')
	) {
		return 'Ось наші контакти:\n📞 +380 XX XXX XX XX\n📧 info@connexi.com.ua\nАбо можемо продовжити спілкування тут!'
	}

	if (message.includes('послуги') || message.includes('сервіс')) {
		return 'Ми надаємо широкий спектр IT-послуг: розробка, дизайн, консалтинг, підтримка. Що саме вас цікавить?'
	}

	// Random response for other messages
	const randomIndex = Math.floor(Math.random() * mockResponses.length)
	return mockResponses[randomIndex]
}

export const useNewChat = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [connectionState, setConnectionState] = useState<ConnectionState>({
		status: 'connecting',
		lastConnected: null,
		retryCount: 0,
	})

	const channelRef = useRef<any>(null)
	const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const heartbeatRef = useRef<NodeJS.Timeout | null>(null)
	const isUnmountedRef = useRef(false)

	// Enhanced chatId with session persistence
	const [chatId] = useState(() => {
		// Try to restore from session storage
		const savedSession = localStorage.getItem(SESSION_STORAGE_KEY)
		if (savedSession) {
			try {
				const parsed = JSON.parse(savedSession)
				if (
					parsed.chatId &&
					parsed.timestamp &&
					Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000
				) {
					console.log('🔄 Restored chat session:', parsed.chatId)
					return parsed.chatId
				}
			} catch (e) {
				console.warn('Failed to parse saved session')
			}
		}

		// Generate new chatId
		const newChatId = `chat_${Date.now()}_${Math.random()
			.toString(36)
			.substring(2, 8)}`

		// Save to session storage
		localStorage.setItem(
			SESSION_STORAGE_KEY,
			JSON.stringify({
				chatId: newChatId,
				timestamp: Date.now(),
			})
		)

		console.log('🆕 Generated new chat session:', newChatId)
		return newChatId
	})

	// Enhanced send message with mock AI response
	const sendMessage = useCallback(
		async (message: string) => {
			setIsLoading(true)
			setError(null)

			try {
				console.log('📤 Відправка повідомлення:', { message, chatId })

				// Check connection before sending
				if (connectionState.status === 'disconnected') {
					throw new Error('Соединение потеряно. Пытаемся переподключиться...')
				}

				// Add user message immediately
				const userMessage: ChatMessage = {
					id: `user-${Date.now()}-${Math.random().toString(36).substring(2)}`,
					content: message,
					role: 'user',
					timestamp: new Date(),
				}

				setMessages(prev => [...prev, userMessage])

				// Simulate API delay
				await new Promise(resolve =>
					setTimeout(resolve, 1000 + Math.random() * 2000)
				)

				// Generate mock AI response
				const aiResponse = getMockResponse(message)
				const assistantMessage: ChatMessage = {
					id: `assistant-${Date.now()}-${Math.random()
						.toString(36)
						.substring(2)}`,
					content: aiResponse,
					role: 'assistant',
					timestamp: new Date(),
				}

				setMessages(prev => [...prev, assistantMessage])

				console.log('✅ Повідомлення відправлено та отримано відповідь')

				// Reset connection state on successful send
				setConnectionState(prev => ({
					...prev,
					status: 'connected',
					lastConnected: new Date(),
					retryCount: 0,
				}))
			} catch (err) {
				console.error('❌ Помилка відправки повідомлення:', err)

				if (err instanceof Error && err.name === 'AbortError') {
					setError('Превышено время ожидания. Проверьте соединение.')
					setConnectionState(prev => ({ ...prev, status: 'reconnecting' }))
				} else {
					const errorMessage =
						err instanceof Error ? err.message : 'Невідома помилка'
					setError(errorMessage)
				}
			} finally {
				setIsLoading(false)
			}
		},
		[chatId, connectionState.status]
	)

	// Enhanced connection establishment (simplified for demo)
	const establishConnection = useCallback(
		async (isReconnect = false) => {
			if (isUnmountedRef.current) return

			console.log(
				`🔗 ${
					isReconnect ? 'Переподключение' : 'Подключение'
				} демо чату для chatId:`,
				chatId
			)

			// Update connection state
			setConnectionState(prev => ({
				...prev,
				status: isReconnect ? 'reconnecting' : 'connecting',
			}))

			try {
				// Simulate connection delay
				await new Promise(resolve => setTimeout(resolve, 1000))

				// Set connected state
				setConnectionState({
					status: 'connected',
					lastConnected: new Date(),
					retryCount: 0,
				})

				console.log('✅ Демо чат підключено')

				// Start heartbeat
				startHeartbeat()

				// Add welcome message for new chats
				if (!isReconnect && messages.length === 0) {
					setTimeout(() => {
						const welcomeMessage: ChatMessage = {
							id: `welcome-${Date.now()}`,
							content:
								'Привіт! Я AI-асистент Connexi. Готовий відповісти на ваші питання про наші послуги. Як справи?',
							role: 'assistant',
							timestamp: new Date(),
						}
						setMessages([welcomeMessage])
					}, 500)
				}
			} catch (error) {
				console.error("💥 Помилка встановлення з'єднання:", error)
				setConnectionState(prev => ({ ...prev, status: 'error' }))
				scheduleReconnect()
			}
		},
		[chatId, messages.length]
	)

	// Heartbeat to detect connection issues
	const startHeartbeat = useCallback(() => {
		if (heartbeatRef.current) {
			clearInterval(heartbeatRef.current)
		}

		heartbeatRef.current = setInterval(() => {
			if (isUnmountedRef.current) return

			const now = new Date()
			setConnectionState(prev => {
				if (
					prev.lastConnected &&
					now.getTime() - prev.lastConnected.getTime() > HEARTBEAT_INTERVAL * 2
				) {
					console.warn('⚠️ Heartbeat timeout detected, reconnecting...')
					scheduleReconnect()
					return { ...prev, status: 'disconnected' }
				}
				return prev
			})
		}, HEARTBEAT_INTERVAL)
	}, [])

	// Schedule reconnection with exponential backoff
	const scheduleReconnect = useCallback(() => {
		if (isUnmountedRef.current) return

		setConnectionState(prev => {
			if (prev.retryCount >= MAX_RETRY_ATTEMPTS) {
				console.error(
					'🚫 Максимальна кількість спроб перепідключення досягнута'
				)
				setError("Не вдалося відновити з'єднання. Перезавантажте сторінку.")
				return { ...prev, status: 'error' }
			}

			const delay = RETRY_DELAY_BASE * Math.pow(2, prev.retryCount)
			console.log(
				`🔄 Плануємо перепідключення через ${delay}ms (спроба ${
					prev.retryCount + 1
				})`
			)

			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current)
			}

			retryTimeoutRef.current = setTimeout(() => {
				if (!isUnmountedRef.current) {
					establishConnection(true)
				}
			}, delay)

			return {
				...prev,
				retryCount: prev.retryCount + 1,
				status: 'reconnecting',
			}
		})
	}, [establishConnection])

	// Main connection effect
	useEffect(() => {
		console.log('🚀 Ініціалізація демо чату для chatId:', chatId)

		// Delay initial connection to avoid race conditions
		const timer = setTimeout(() => {
			if (!isUnmountedRef.current) {
				establishConnection(false)
			}
		}, 500)

		return () => {
			clearTimeout(timer)
		}
	}, [establishConnection])

	// Cleanup effect
	useEffect(() => {
		return () => {
			console.log('🧹 Очищення ресурсів демо чату')
			isUnmountedRef.current = true

			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current)
			}

			if (heartbeatRef.current) {
				clearInterval(heartbeatRef.current)
			}
		}
	}, [])

	// Auto-reconnect on window focus
	useEffect(() => {
		const handleFocus = () => {
			if (
				connectionState.status === 'disconnected' ||
				connectionState.status === 'error'
			) {
				console.log('👁️ Вікно отримало фокус, пробуємо перепідключитися')
				setConnectionState(prev => ({ ...prev, retryCount: 0 }))
				establishConnection(true)
			}
		}

		window.addEventListener('focus', handleFocus)
		return () => window.removeEventListener('focus', handleFocus)
	}, [connectionState.status, establishConnection])

	const clearError = useCallback(() => {
		setError(null)
	}, [])

	// Manual reconnect function
	const reconnect = useCallback(() => {
		setConnectionState(prev => ({ ...prev, retryCount: 0 }))
		establishConnection(true)
	}, [establishConnection])

	return {
		messages,
		isLoading,
		error,
		sendMessage,
		clearError,
		chatId,
		connectionState,
		reconnect,
	}
}
