
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnreadMessages = (userId: string | undefined) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  useEffect(() => {
    if (!userId) return;
    
    const checkUnreadMessages = async () => {
      try {
        // Get all conversations the user is part of
        const { data: participantData } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', userId);
          
        if (!participantData || participantData.length === 0) return;
        
        const conversationIds = participantData.map(p => p.conversation_id);
        
        // Get unread messages count
        const { count, error } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact' })
          .in('conversation_id', conversationIds)
          .eq('read', false)
          .neq('sender_id', userId);
          
        if (error) {
          console.error('Error getting unread messages:', error);
          return;
        }
        
        setUnreadMessages(count || 0);
      } catch (error) {
        console.error('Error checking unread messages:', error);
      }
    };
    
    checkUnreadMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages_changes')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          checkUnreadMessages();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
  return unreadMessages;
};
