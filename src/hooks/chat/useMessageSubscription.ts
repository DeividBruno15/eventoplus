
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';

export function useMessageSubscription(
  conversationId: string, 
  userId: string | undefined,
  fetchMessages: () => Promise<void>
) {
  // Helper function to check if id is a valid UUID
  const isValidUUID = (id: string) => {
    if (!id) return false;
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(id);
  };
  
  useEffect(() => {
    if (!conversationId || !userId) return;

    // Set up real-time subscription for new messages for real conversations
    if (isValidUUID(conversationId)) {
      const channel = supabase
        .channel('chat_messages')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public',
            table: 'chat_messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          async (payload) => {
            // New message received
            const newMessage = payload.new as Message;
            
            // If the message is from another user, mark it as read immediately
            if (newMessage.sender_id !== userId) {
              await supabase
                .from('chat_messages')
                .update({ read: true })
                .eq('id', newMessage.id);
            }
            
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, userId, fetchMessages]);
}
