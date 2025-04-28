
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    
    // Create a subscription expiring in 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    // Check for existing subscription
    logStep("Checking for existing subscription");
    const { data: existingSubscription, error: subCheckError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    if (subCheckError && subCheckError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw new Error(`Failed to check existing subscription: ${subCheckError.message}`);
    }
    
    if (existingSubscription) {
      logStep("Found existing subscription - updating it", { 
        subscriptionId: existingSubscription.id
      });
      
      // Update existing subscription
      const { data: updatedSub, error: updateError } = await supabase
        .from('subscriptions')
        .update({
          plan_id: planId,
          plan_name: planName,
          expires_at: expiryDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSubscription.id)
        .select()
        .single();
      
      if (updateError) {
        throw new Error(`Failed to update subscription: ${updateError.message}`);
      }
      
      logStep("Existing subscription updated", { 
        subscriptionId: updatedSub.id 
      });
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          subscription: updatedSub
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Record new subscription in database
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
