
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Inicializar Stripe e Supabase
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Criar cliente Supabase com a service role key para poder escrever no banco
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Obter usuário autenticado
    const authHeader = req.headers.get('Authorization')
    let userId = null

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabaseAdmin.auth.getUser(token)
      if (user) {
        userId = user.id
      }
    }
    
    // Se não houver usuário, retornar erro
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Obter parâmetros do request
    const { paymentId, amount, reason } = await req.json()
    
    if (!paymentId) {
      throw new Error('Payment ID is required')
    }

    // Buscar informações do pagamento
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('stripe_payment_id', paymentId)
      .single()

    if (paymentError || !paymentData) {
      throw new Error('Payment not found')
    }

    // Verificar se o usuário é o dono do pagamento
    if (paymentData.user_id !== userId) {
      throw new Error('Unauthorized. You can only refund your own payments')
    }

    // Processar reembolso via Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
      amount: amount || undefined, // Se não informado, reembolsa o valor total
      reason: (reason === 'duplicate' || reason === 'fraudulent' || reason === 'requested_by_customer') 
        ? reason 
        : 'requested_by_customer'
    })

    // Atualizar o status do pagamento no banco de dados
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_payment_id', paymentId)

    if (updateError) {
      console.error('Error updating payment record:', updateError)
    }

    // Registrar o reembolso no histórico
    const { error: refundLogError } = await supabaseAdmin
      .from('payment_refunds')
      .insert({
        payment_id: paymentData.id,
        user_id: userId,
        amount: amount || paymentData.amount,
        reason: reason || 'requested_by_customer',
        stripe_refund_id: refund.id,
        status: refund.status
      })

    if (refundLogError) {
      console.error('Error logging refund:', refundLogError)
    }

    // Criar notificação para o usuário
    const { error: notificationError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Reembolso processado',
        content: `Seu reembolso de R$ ${((amount || paymentData.amount) / 100).toFixed(2)} foi processado com sucesso.`,
        type: 'payment',
        link: '/payments',
        read: false
      })

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        refundId: refund.id, 
        refundAmount: amount || paymentData.amount 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing refund:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
