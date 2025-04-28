
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function for logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Stripe
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response(
      JSON.stringify({ error: "Stripe key not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  // Initialize Supabase with service role key for admin operations
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });

  try {
    logStep("Function started");

    // Extract user token from authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    
    // Authenticate user
    logStep("Authenticating user");
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !userData.user) {
      throw new Error("Authentication failed");
    }
    
    const user = userData.user;
    logStep("User authenticated", { userId: user.id });
    
    // Parse request body
    const { planId, planName, role } = await req.json();
    if (!planId || !planName || !role) {
      throw new Error("Missing required parameters");
    }
    
    logStep("Request data", { planId, planName, role });
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Look for existing customer
    logStep("Looking for existing Stripe customer");
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      // Create new customer
      logStep("Creating new customer");
      const newCustomer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.first_name 
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
          : undefined,
      });
      customerId = newCustomer.id;
      logStep("Created new customer", { customerId });
    }
    
    // Create a subscription expiring in 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    // Record subscription in database
    logStep("Creating subscription record");
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        plan_name: planName,
        role: role,
        status: 'active',
        expires_at: expiryDate.toISOString(),
      })
      .select()
      .single();
    
    if (subscriptionError) {
      throw new Error(`Failed to create subscription record: ${subscriptionError.message}`);
    }
    
    logStep("Subscription created successfully", { subscriptionId: subscription.id });
    
    // Return success with subscription details
    return new Response(
      JSON.stringify({ 
        success: true, 
        subscription: {
          id: subscription.id,
          plan_id: subscription.plan_id,
          plan_name: subscription.plan_name,
          expires_at: subscription.expires_at
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
