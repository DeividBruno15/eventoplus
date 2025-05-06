
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Inicializar cliente Supabase com a service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Obter dados do request
    const { paymentId, status } = await req.json()

    // Verificar se temos os dados necessários
    if (!paymentId) {
      throw new Error('Payment ID is required')
    }

    // Buscar o pagamento no banco
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('stripe_payment_id', paymentId)
      .single()

    if (paymentError) {
      throw new Error(`Payment not found: ${paymentError.message}`)
    }

    // Atualizar o status do pagamento
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_payment_id', paymentId)

    if (updateError) {
      throw new Error(`Failed to update payment: ${updateError.message}`)
    }

    // Enviar notificação ao usuário
    if (status === 'succeeded') {
      // Criar notificação de pagamento bem-sucedido
      const { error: notificationError } = await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: paymentData.user_id,
          title: 'Pagamento confirmado',
          content: `Seu pagamento de R$ ${(paymentData.amount / 100).toFixed(2)} foi processado com sucesso.`,
          type: 'payment',
          link: '/payments',
          read: false
        })

      if (notificationError) {
        console.error('Error creating notification:', notificationError)
      }
    } else if (status === 'failed') {
      // Criar notificação de pagamento falho
      const { error: notificationError } = await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: paymentData.user_id,
          title: 'Problema com pagamento',
          content: `Houve um problema com seu pagamento de R$ ${(paymentData.amount / 100).toFixed(2)}. Por favor, verifique.`,
          type: 'payment',
          link: '/payments',
          read: false
        })

      if (notificationError) {
        console.error('Error creating notification:', notificationError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment status updated successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error updating payment status:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
