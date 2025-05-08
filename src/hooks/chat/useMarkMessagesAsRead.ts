
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useMarkMessagesAsRead = (conversationId: string | undefined) => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!conversationId || !user) return;
    
    const markMessagesAsRead = async () => {
      try {
        console.log('Marcando mensagens como lidas:', conversationId);
        
        // Atualiza todas as mensagens não lidas na conversa onde o usuário atual é o destinatário
        const { error } = await supabase
          .from('chat_messages')
          .update({ read: true })
          .eq('conversation_id', conversationId)
          .eq('read', false)
          .neq('sender_id', user.id);
        
        if (error) {
          console.error('Erro ao marcar mensagens como lidas:', error);
        }
      } catch (error) {
        console.error('Erro inesperado ao marcar mensagens como lidas:', error);
      }
    };
    
    // Marcar mensagens como lidas quando a conversa é aberta
    markMessagesAsRead();
    
    // Configurar uma assinatura para marcar novas mensagens recebidas como lidas
    const channel = supabase
      .channel(`conversation:${conversationId}:read`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, () => {
        markMessagesAsRead();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);
};
