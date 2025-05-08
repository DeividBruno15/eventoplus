
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const supabaseAdmin = createClient(
    supabaseUrl,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
    { auth: { persistSession: false } }
  );

  try {
    // Parse request body
    const { session_id } = await req.json();
    
    if (!session_id) {
      return new Response(JSON.stringify({ error: "Session ID is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Get the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (!session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }
    
    // Check if payment is successful
    const isSuccessful = session.payment_status === "paid";
    
    // Find the payment in the database
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("id, status")
      .eq("stripe_payment_id", session_id)
      .single();
      
    if (paymentError) {
      console.error("Error fetching payment:", paymentError);
      return new Response(JSON.stringify({ error: "Error fetching payment" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    // If the payment is successful but not updated in DB, update it
    if (isSuccessful && paymentData.status !== "succeeded") {
      const { error: updateError } = await supabaseAdmin
        .from("payments")
        .update({ status: "succeeded" })
        .eq("id", paymentData.id);
        
      if (updateError) {
        console.error("Error updating payment status:", updateError);
      }
      
      // Send notification to venue owner about the new booking
      if (session.metadata?.venue_id && session.metadata?.user_id) {
        try {
          // Get venue owner ID
          const { data: venueData } = await supabaseAdmin
            .from("venue_announcements")
            .select("user_id, title")
            .eq("id", session.metadata.venue_id)
            .single();
            
          if (venueData) {
            // Create a notification for the venue owner
            await supabaseAdmin.from("notifications").insert({
              user_id: venueData.user_id,
              title: "Nova reserva!",
              content: `Você recebeu uma nova reserva para ${venueData.title}`,
              type: "booking",
              link: `/venues/${session.metadata.venue_id}`
            });
            
            // Create a notification for the user who booked
            await supabaseAdmin.from("notifications").insert({
              user_id: session.metadata.user_id,
              title: "Reserva confirmada!",
              content: `Sua reserva para ${venueData.title} foi confirmada`,
              type: "booking_confirmation",
              link: `/venues/${session.metadata.venue_id}`
            });
          }
        } catch (notifyError) {
          console.error("Error sending notifications:", notifyError);
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: isSuccessful,
      payment_id: paymentData?.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message, success: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
