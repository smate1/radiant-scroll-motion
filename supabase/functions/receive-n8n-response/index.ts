
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, chatId, userId } = await req.json()
    
    console.log('Получен ответ от n8n:', { message, chatId, userId })

    if (!message || !chatId) {
      return new Response(
        JSON.stringify({ error: 'Требуются поля message и chatId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Инициализируем Supabase клиент
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Сохраняем ответ ассистента в таблицу chat_messages
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: chatId,
        message: message,
        role: 'assistant'
      })
      .select()

    if (error) {
      console.error('Ошибка сохранения в БД:', error)
      return new Response(
        JSON.stringify({ error: 'Ошибка сохранения сообщения' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Ответ ассистента сохранен в БД:', data)

    // Принудительно отправляем Realtime уведомление через канал
    if (data && data.length > 0) {
      const newMessage = data[0]
      console.log('Отправляем Realtime уведомление для сообщения:', newMessage.id)
      
      // Создаем канал для отправки уведомления
      const channelName = `chat-messages-${chatId}`
      const channel = supabase.channel(channelName)
      
      // Отправляем уведомление напрямую через канал
      await channel.send({
        type: 'broadcast',
        event: 'new_message',
        payload: {
          id: newMessage.id,
          chat_id: newMessage.chat_id,
          message: newMessage.message,
          role: newMessage.role,
          created_at: newMessage.created_at
        }
      })
      
      console.log('Realtime уведомление отправлено через канал:', channelName)
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Ответ получен и сохранен', data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Ошибка в receive-n8n-response function:', error)
    return new Response(
      JSON.stringify({ error: 'Внутренняя ошибка сервера' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
