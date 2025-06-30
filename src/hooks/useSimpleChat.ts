import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

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

const SESSION_STORAGE_KEY = 'conexy_chat_session'

export const useSimpleChat = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [connectionState, setConnectionState] = useState<ConnectionState>({
		status: 'connecting',
		lastConnected: null,
		retryCount: 0,
	})
	const [reconnectTrigger, setReconnectTrigger] = useState(0)
	const channelRef = useRef<RealtimeChannel | null>(null)

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

	const addMessage = useCallback(
		(content: string, role: 'user' | 'assistant') => {
			const newMessage: ChatMessage = {
				id: `${role}-${Date.now()}-${Math.random().toString(36).substring(2)}`,
				content,
				role,
				timestamp: new Date(),
			}

			setMessages(prev => [...prev, newMessage])
		},
		[]
	)

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

				// Отправляем сообщение в n8n через edge function
				const { error: functionError } = await supabase.functions.invoke(
					'chat-handler',
					{
						body: { message, chatId },
					}
				)

				if (functionError) {
					throw new Error(functionError.message || 'Ошибка отправки в n8n')
				}

				console.log('✅ Повідомлення відправлено в обработку')

				// Reset connection state on successful send
				setConnectionState(prev => ({
					...prev,
					status: 'connected',
					lastConnected: new Date(),
					retryCount: 0,
				}))
			} catch (err) {
				console.error('❌ Помилка відправки повідомлення:', err)
				const errorMessage =
					err instanceof Error ? err.message : 'Неизвестная ошибка'
				setError(errorMessage)
				setConnectionState(prev => ({ ...prev, status: 'error' }))
			} finally {
				setIsLoading(false)
			}
		},
		[chatId, connectionState.status]
	)

	// Manual reconnect function
	const reconnect = useCallback(() => {
		console.log('🔄 Manual reconnect triggered')
		setConnectionState(prev => ({
			...prev,
			retryCount: 0,
			status: 'connecting',
		}))

		// Cleanup existing channel
		if (channelRef.current) {
			supabase.removeChannel(channelRef.current)
			channelRef.current = null
		}

		// Trigger reconnection
		setReconnectTrigger(prev => prev + 1)
	}, [])

	// Создаем подписку только один раз при монтировании
	useEffect(() => {
		console.log('🚀 Establishing database connection for chatId:', chatId)

		if (channelRef.current) {
			console.log('🔄 Connection already exists, skipping')
			return
		}

		setConnectionState(prev => ({ ...prev, status: 'connecting' }))

		const channel = supabase
			.channel('chat-messages-optimized')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'chat_messages',
				},
				(payload: {
					new: {
						id: string
						message: string
						role: string
						created_at: string
						chat_id: string
					}
				}) => {
					console.log('📨 Новое сообщение получено:', payload.new)
					const newMessage: ChatMessage = {
						id: payload.new.id,
						content: payload.new.message,
						role: payload.new.role as 'user' | 'assistant',
						timestamp: new Date(payload.new.created_at),
					}

					setMessages(prev => {
						// Проверяем, нет ли уже такого сообщения
						const exists = prev.some(msg => msg.id === newMessage.id)
						if (exists) return prev

						return [...prev, newMessage]
					})
				}
			)
			.subscribe(status => {
				console.log('📡 Subscription status:', status)
				if (status === 'SUBSCRIBED') {
					setConnectionState(prev => ({
						...prev,
						status: 'connected',
						lastConnected: new Date(),
						retryCount: 0,
					}))
				} else if (status === 'CHANNEL_ERROR') {
					setConnectionState(prev => ({ ...prev, status: 'error' }))
				}
			})

		channelRef.current = channel

		return () => {
			console.log('🧹 Cleaning up database connection')
			if (channelRef.current) {
				supabase.removeChannel(channelRef.current)
				channelRef.current = null
			}
		}
	}, [chatId, reconnectTrigger]) // Added reconnectTrigger to recreate connection

	const clearError = useCallback(() => {
		setError(null)
	}, [])

	return {
		messages,
		isLoading,
		error,
		sendMessage,
		addMessage,
		clearError,
		chatId,
		connectionState,
		reconnect,
	}
} 
