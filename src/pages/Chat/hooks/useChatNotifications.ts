
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useChatNotifications() {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  const sendMessageNotification = async (
    recipientId: string,
    senderName: string,
    message: string,
    conversationId: string
  ) => {
    if (!recipientId) return false;
    
    setIsSending(true);
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: recipientId,
        title: `Nova mensagem de ${senderName}`,
        content: message.length > 60 ? `${message.substring(0, 57)}...` : message,
        type: 'message',
        link: `/conversation/${conversationId}`,
        read: false
      });
      
      if (error) {
        console.error('Erro ao enviar notificação de mensagem:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação de mensagem:', error);
      return false;
    } finally {
      setIsSending(false);
    }
  };
  
  return {
    isSending,
    sendMessageNotification
  };
}
