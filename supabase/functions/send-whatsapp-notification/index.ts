
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verifica se é uma chamada de webhook
    if (req.headers.get('x-whatsapp-webhook-secret') === Deno.env.get('WHATSAPP_WEBHOOK_SECRET')) {
      // Processa webhook do WhatsApp
      const data = await req.json();
      
      console.log('Webhook recebido do WhatsApp:', data);
      
      // Aqui você processaria os eventos do webhook
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Caso contrário, assumir que é uma solicitação para enviar notificação
    const { phone_number, message, user_id } = await req.json();
    
    if (!phone_number || !message || !user_id) {
      throw new Error('Parâmetros inválidos. Necessário: phone_number, message e user_id');
    }
    
    // Verificar se o usuário existe
    const { data: user, error: userError } = await supabaseClient
      .from('user_profiles')
      .select('phone_number')
      .eq('id', user_id)
      .single();
      
    if (userError) {
      throw new Error(`Erro ao buscar usuário: ${userError.message}`);
    }
    
    if (!user.phone_number) {
      throw new Error('Usuário não possui número de telefone registrado');
    }
    
    // Aqui você integraria com o serviço de WhatsApp (Twilio, 360dialog, Z-API, etc)
    // Este é um exemplo usando a API do Twilio WhatsApp
    
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
    
    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      throw new Error('Configurações do Twilio não encontradas');
    }
    
    // Formatar o número de telefone para o formato internacional
    let formattedPhone = phone_number.replace(/\D/g, '');
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+55${formattedPhone}`; // Adicionar código do país (Brasil)
    }
    
    // Enviar mensagem via Twilio
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
        },
        body: new URLSearchParams({
          From: `whatsapp:${twilioPhoneNumber}`,
          To: `whatsapp:${formattedPhone}`,
          Body: message,
        }),
      }
    );
    
    const twilioData = await twilioResponse.json();
    
    if (!twilioResponse.ok) {
      throw new Error(`Erro ao enviar mensagem via Twilio: ${JSON.stringify(twilioData)}`);
    }
    
    // Registrar a notificação enviada
    await supabaseClient
      .from('notifications')
      .insert({
        user_id,
        title: 'Notificação WhatsApp',
        content: message,
        type: 'whatsapp',
      });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notificação WhatsApp enviada com sucesso',
        twilioData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

