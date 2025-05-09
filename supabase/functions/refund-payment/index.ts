
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
    
    // Get request body
    const { paymentId, amount, reason } = await req.json();
    
    // Validate required parameters
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }
    
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error('Authentication failed');
    }
    
    const userId = userData.user.id;
    
    // Get payment information from database
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', userId)
      .single();
    
    if (paymentError) {
      throw new Error(`Payment not found: ${paymentError.message}`);
    }
    
    if (payment.status !== 'succeeded') {
      throw new Error('Only successful payments can be refunded');
    }
    
    // Check if there's already a full refund for this payment
    const { data: existingRefunds, error: refundError } = await supabaseAdmin
      .from('payment_refunds')
      .select('*')
      .eq('payment_id', paymentId)
      .order('created_at', { ascending: false });
    
    if (refundError) {
      throw new Error(`Error checking existing refunds: ${refundError.message}`);
    }
    
    const totalRefunded = existingRefunds?.reduce((sum, refund) => sum + refund.amount, 0) || 0;
    const remainingRefundable = payment.amount - totalRefunded;
    
    if (remainingRefundable <= 0) {
      throw new Error('This payment has already been fully refunded');
    }
    
    // Determine refund amount
    const refundAmount = amount || remainingRefundable;
    
    if (refundAmount > remainingRefundable) {
      throw new Error(`Cannot refund more than the remaining refundable amount (${remainingRefundable / 100})`);
    }
    
    // Create refund in Stripe
    let stripeRefund;
    try {
      stripeRefund = await stripe.refunds.create({
        payment_intent: payment.stripe_payment_intent_id,
        amount: refundAmount,
        reason: 'requested_by_customer',
      });
    } catch (stripeError: any) {
      console.error('Stripe refund error:', stripeError);
      throw new Error(`Stripe refund failed: ${stripeError.message}`);
    }
    
    // Record refund in database
    const { data: refundData, error: insertError } = await supabaseAdmin
      .from('payment_refunds')
      .insert({
        payment_id: paymentId,
        user_id: userId,
        amount: refundAmount,
        reason: reason || 'Customer requested refund',
        status: 'succeeded',
        stripe_refund_id: stripeRefund.id,
        is_partial: refundAmount < payment.amount,
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Database refund record error:', insertError);
      throw new Error(`Failed to record refund: ${insertError.message}`);
    }
    
    // Update payment status if fully refunded
    if (refundAmount === payment.amount || totalRefunded + refundAmount >= payment.amount) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'refunded' })
        .eq('id', paymentId);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        refundId: refundData.id,
        refundAmount: refundAmount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error: any) {
    console.error('Error processing refund:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to process refund',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
