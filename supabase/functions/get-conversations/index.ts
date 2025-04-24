
// Função auxiliar para buscar conversas
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
    // Cria o cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extrai o token Bearer
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const userId = user.id;
    
    // Busca todas as conversas do usuário
    const { data: participations, error: participationsError } = await supabaseClient
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);
      
    if (participationsError) {
      throw participationsError;
    }
    
    if (!participations || participations.length === 0) {
      return new Response(
        JSON.stringify({ data: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const conversationIds = participations.map(p => p.conversation_id);
    
    // Busca detalhes de todas as conversas
    const { data: conversations, error: conversationsError } = await supabaseClient
      .from('conversations')
      .select('id, updated_at')
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });
      
    if (conversationsError) {
      throw conversationsError;
    }
    
    // Para cada conversa, busca o outro participante e a última mensagem
    const conversationsWithDetails = await Promise.all(
      (conversations || []).map(async (conv) => {
        // Busca o outro participante
        const { data: otherParticipants, error: participantsError } = await supabaseClient
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conv.id)
          .neq('user_id', userId);
          
        if (participantsError) {
          throw participantsError;
        }
        
        if (!otherParticipants || otherParticipants.length === 0) {
          return null;
        }
        
        const otherUserId = otherParticipants[0].user_id;
        
        // Busca os dados do outro usuário
        const { data: otherUserData, error: otherUserError } = await supabaseClient
          .from('user_profiles')
          .select('id, first_name, last_name')
          .eq('id', otherUserId)
          .single();
          
        if (otherUserError) {
          throw otherUserError;
        }
        
        // Busca a última mensagem
        const { data: messages, error: messagesError } = await supabaseClient
          .from('chat_messages')
          .select('message, created_at, sender_id, read')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (messagesError) {
          throw messagesError;
        }
        
        let lastMessage = null;
        if (messages && messages.length > 0) {
          lastMessage = {
            message: messages[0].message,
            created_at: messages[0].created_at,
            is_read: messages[0].read,
            is_mine: messages[0].sender_id === userId
          };
        }
        
        return {
          id: conv.id,
          updated_at: conv.updated_at,
          otherUser: otherUserData,
          lastMessage
        };
      })
    );
    
    // Filtra conversas nulas
    const validConversations = conversationsWithDetails.filter(Boolean);
    
    return new Response(
      JSON.stringify({ data: validConversations }),
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
