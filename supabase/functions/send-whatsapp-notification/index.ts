
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import twilio from 'https://esm.sh/twilio@4.19.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função de log para facilitar o debug
const log = (message: string, data?: any) => {
  console.log(`[WHATSAPP] ${message}`, data ? JSON.stringify(data) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    log('Inicializando função');
    
    // Inicializar cliente Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Verificar se é uma chamada de webhook do Twilio
    if (req.headers.get('x-twilio-signature')) {
      log('Recebido webhook do Twilio');
      
      try {
        const formData = await req.formData();
        const data: Record<string, any> = {};
        for (const [key, value] of formData.entries()) {
          data[key] = value;
        }
        
        log('Dados do webhook', data);
        
        // Processar resposta do usuário
        if (data.Body && data.From) {
          const userMessage = String(data.Body).trim();
          const userPhone = String(data.From).replace('whatsapp:', '');
          
          log(`Mensagem recebida de ${userPhone}:`, userMessage);

          // Buscar usuário pelo número de telefone
          const { data: userData, error: userError } = await supabaseAdmin
            .from('user_profiles')
            .select('id, first_name')
            .eq('phone_number', userPhone.replace('+55', ''))
            .single();
          
          if (userError || !userData) {
            log('Usuário não encontrado para o número', userPhone);
          } else {
            log('Usuário encontrado', userData);
            
            // Registrar a mensagem no sistema
            await supabaseAdmin.from('bot_messages').insert({
              user_id: userData.id,
              message: userMessage,
              direction: 'inbound'
            });
            
            // Responder automaticamente
            const responseMessage = `Olá ${userData.first_name || 'usuário'}, recebemos sua mensagem: "${userMessage}". Um de nossos atendentes entrará em contato em breve.`;
            
            // Enviar resposta via Twilio
            const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
            const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
            const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
            
            if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
              const twilioClient = twilio(twilioAccountSid, twilioAuthToken);
              
              await twilioClient.messages.create({
                from: `whatsapp:${twilioPhoneNumber}`,
                to: data.From,
                body: responseMessage
              });
              
              // Registrar a resposta automática
              await supabaseAdmin.from('bot_messages').insert({
                user_id: userData.id,
                message: responseMessage,
                direction: 'outbound',
                is_auto_reply: true
              });
              
              log('Resposta automática enviada');
            }
          }
        }
        
        // Retornar TwiML de resposta vazia para Twilio
        return new Response(
          '<?xml version="1.0" encoding="UTF-8"?><Response></Response>', 
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'text/xml' 
            } 
          }
        );
      } catch (webhookError) {
        log('Erro ao processar webhook', webhookError);
        return new Response(
          '<?xml version="1.0" encoding="UTF-8"?><Response></Response>', 
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'text/xml' 
            } 
          }
        );
      }
    }
    
    // Caso contrário, processar uma solicitação de envio de mensagem
    const requestData = await req.json();
    log('Processando solicitação de envio', requestData);
    
    const { phone_number, message, user_id } = requestData;
    
    if (!phone_number || !message || !user_id) {
      throw new Error('Parâmetros inválidos. Necessário: phone_number, message e user_id');
    }
    
    // Verificar se o usuário existe
    const { data: user, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('phone_number, whatsapp_opt_in')
      .eq('id', user_id)
      .single();
      
    if (userError || !user) {
      throw new Error(`Usuário não encontrado: ${userError?.message || 'ID inválido'}`);
    }
    
    if (!user.whatsapp_opt_in) {
      log('Usuário não optou por receber mensagens WhatsApp', user_id);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Usuário não optou por receber mensagens via WhatsApp' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let formattedPhone = phone_number.replace(/\D/g, '');
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+55${formattedPhone}`;
    }
    
    log('Enviando mensagem para', formattedPhone);
    
    // Enviar mensagem via Twilio
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
    
    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      throw new Error('Configurações do Twilio não encontradas');
    }
    
    const twilioClient = twilio(twilioAccountSid, twilioAuthToken);
    
    try {
      const twilioMessage = await twilioClient.messages.create({
        from: `whatsapp:${twilioPhoneNumber}`,
        to: `whatsapp:${formattedPhone}`,
        body: message,
      });
      
      log('Mensagem enviada com sucesso', { messageId: twilioMessage.sid });
      
      // Registrar mensagem enviada
      await supabaseAdmin.from('bot_messages').insert({
        user_id,
        message,
        direction: 'outbound',
        twilio_message_id: twilioMessage.sid
      });
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Notificação WhatsApp enviada com sucesso',
          messageId: twilioMessage.sid
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (twilioError: any) {
      log('Erro ao enviar mensagem via Twilio', twilioError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erro ao enviar mensagem: ${twilioError.message}`,
          code: twilioError.code
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error: any) {
    log('Erro geral', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
