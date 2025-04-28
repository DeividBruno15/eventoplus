
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated')
    }

    const { planId, role } = await req.json()
    
    // Get origin for success/cancel URLs
    const origin = req.headers.get('origin') || 'http://localhost:3000'

    // Get price based on plan ID
    const amount = getPlanPrice(planId)

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userData.user.email,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { name: `Plano ${getPlanName(planId)}` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/plans?success=true`,
      cancel_url: `${origin}/plans?canceled=true`,
      metadata: {
        planId,
        userId: userData.user.id,
        role
      },
    })

    // Create subscription record in Supabase
    const { error: subscriptionError } = await supabaseClient.from('subscriptions').insert({
      user_id: userData.user.id,
      plan_id: planId,
      plan_name: getPlanName(planId),
      role: role,
      status: 'pending',
      stripe_subscription_id: session.id
    })

    if (subscriptionError) {
      console.error('Error creating subscription record:', subscriptionError)
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

// Helper function to get price based on plan ID
function getPlanPrice(planId: string): number {
  // Provider plans
  if (planId === 'provider-essential') return 0
  if (planId === 'provider-professional') return 1490 // R$ 14.90
  if (planId === 'provider-premium') return 2990 // R$ 29.90
  
  // Contractor plans
  if (planId === 'contractor-discover') return 0
  if (planId === 'contractor-connect') return 1490 // R$ 14.90
  if (planId === 'contractor-management') return 2990 // R$ 29.90
  
  // Default price for unknown plans
  return 0
}

// Helper function to get plan name based on plan ID
function getPlanName(planId: string): string {
  // Provider plans
  if (planId === 'provider-essential') return 'Provider Essential'
  if (planId === 'provider-professional') return 'Provider Professional'
  if (planId === 'provider-premium') return 'Provider Premium'
  
  // Contractor plans
  if (planId === 'contractor-discover') return 'Contractor Discover'
  if (planId === 'contractor-connect') return 'Contractor Connect'
  if (planId === 'contractor-management') return 'Contractor Management'
  
  // Default name for unknown plans
  return 'Plano'
}
