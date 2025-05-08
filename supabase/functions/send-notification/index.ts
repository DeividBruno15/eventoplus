
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
    // Inicializar cliente Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Obter dados do request
    const { 
      userId, 
      title, 
      content, 
      type, 
      link, 
      sendWhatsApp = false 
    } = await req.json();

    // Verificar dados obrigatórios
    if (!userId || !title || !content) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Dados incompletos. userId, title e content são obrigatórios.' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Criar notificação no banco de dados
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
      throw new Error(`Erro ao criar notificação: ${error.message}`);
    }

    // Se solicitado, enviar notificação por WhatsApp
    let whatsappResult = null;
    if (sendWhatsApp) {
      try {
        // Buscar informações do usuário
        const { data: userData, error: userError } = await supabaseAdmin
          .from('user_profiles')
          .select('phone_number, whatsapp_opt_in')
          .eq('id', userId)
          .single();
          
        if (userError) {
          console.error('Erro ao buscar perfil do usuário:', userError);
        } else if (userData?.phone_number && userData?.whatsapp_opt_in) {
          // Enviar notificação via WhatsApp
          const whatsappResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-whatsapp-notification`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id: userId,
              phone_number: userData.phone_number,
              message: `${title}\n\n${content}${link ? `\n\nAcesse: ${link}` : ''}`
            })
          });
          
          if (whatsappResponse.ok) {
            whatsappResult = await whatsappResponse.json();
          } else {
            console.error('Erro ao enviar notificação WhatsApp:', await whatsappResponse.text());
          }
        }
      } catch (whatsappError) {
        console.error('Erro ao processar notificação WhatsApp:', whatsappError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        notification: data,
        whatsapp: whatsappResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Erro ao processar notificação:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Erro ao processar notificação: ${error.message}` 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
