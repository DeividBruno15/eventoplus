
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get request data
    const { 
      userId, 
      title, 
      content, 
      type, 
      link 
    } = await req.json();

    // Validate required data
    if (!userId || !title || !content) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Incomplete data. userId, title, and content are required.' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create notification in database
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        content,
        type: type || 'generic',
        link,
        read: false
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating notification: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        notification: data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error processing notification:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error processing notification: ${error.message}` 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
