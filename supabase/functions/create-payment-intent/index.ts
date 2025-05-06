
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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

    const { amount, planId, eventId } = await req.json()
    
    // Descrição do pagamento baseado no plano
    let paymentDescription = 'Pagamento'
    if (planId === 'provider-professional') {
      paymentDescription = 'Plano Provider Professional'
    } else if (planId === 'provider-premium') {
      paymentDescription = 'Plano Provider Premium'
    } else if (planId === 'contractor-connect') {
      paymentDescription = 'Plano Contractor Connect'
    } else if (planId === 'contractor-management') {
      paymentDescription = 'Plano Contractor Management'
    } else if (eventId) {
      paymentDescription = `Pagamento para evento ${eventId}`
    }
    
    // Criar intent de pagamento
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      automatic_payment_methods: { enabled: true },
      metadata: {
        planId,
        userId,
        eventId,
      },
    })

    // Registrar o pagamento no banco de dados
    const { error: dbError } = await supabaseAdmin.from('payments').insert({
      user_id: userId,
      amount,
      stripe_payment_id: paymentIntent.id,
      status: 'pending',
      description: paymentDescription
    })

    if (dbError) {
      console.error('Error inserting payment record:', dbError)
    }

    // Configurar webhook para receber atualizações de pagamento
    const origin = req.headers.get('origin') || 'http://localhost:3000'
    
    // Enviar resposta com client secret
    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
