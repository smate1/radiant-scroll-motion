
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
    const { message, chatId } = await req.json()
    
    console.log('Получено сообщение для отправки в n8n:', { message, chatId })

    if (!message || !chatId) {
      return new Response(
        JSON.stringify({ error: 'Требуются поля message и chatId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Сначала сохраняем сообщение пользователя в БД
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error: insertError } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: chatId,
        message: message,
        role: 'user'
      })

    if (insertError) {
      console.error('Ошибка сохранения сообщения пользователя:', insertError)
      return new Response(
        JSON.stringify({ error: 'Ошибка сохранения сообщения' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Отправляем сообщение в n8n
    const n8nResponse = await fetch('https://n8n.srv838454.hstgr.cloud/webhook/84ac1eaf-efe6-4517-bc28-5b239286b274', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        chat_id: chatId
      })
    })

    if (!n8nResponse.ok) {
      console.error('Ошибка отправки в n8n:', n8nResponse.status, n8nResponse.statusText)
      return new Response(
        JSON.stringify({ error: 'Ошибка отправки в n8n' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Сообщение успешно отправлено в n8n')
    
    return new Response(
      JSON.stringify({ success: true, message: 'Сообщение отправлено в обработку' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Ошибка в chat-handler function:', error)
    return new Response(
      JSON.stringify({ error: 'Внутренняя ошибка сервера' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
