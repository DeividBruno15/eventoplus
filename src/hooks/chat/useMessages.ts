
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';

export function useMessages(conversationId: string, userId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to check if id is a valid UUID
  const isValidUUID = (id: string) => {
    if (!id) return false;
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(id);
  };

  // For demo/mock conversations with numeric IDs
  const getMockMessages = (id: string) => {
    // Only create mock data if we explicitly have a temporary ID format
    if (id.startsWith('new-')) {
      return [];
    }
    return null;
  };

  const fetchMessages = async () => {
    if (!conversationId || !userId) return;

    try {
      setLoading(true);
      
      // Handle mock conversations with non-UUID IDs
      if (!isValidUUID(conversationId)) {
        console.log('Using temporary conversation data');
        const mockMessages = getMockMessages(conversationId);
        
        if (mockMessages) {
          setMessages(mockMessages);
        }
        setLoading(false);
        return;
      }
      
      // Handle real conversations with UUID IDs
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setMessages(data);
        
        // Mark unread messages as read
        const unreadMessages = data.filter(msg => 
          !msg.read && msg.sender_id !== userId
        );
        
        if (unreadMessages?.length > 0) {
          await supabase
            .from('chat_messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!conversationId || !userId) return;
    
    try {
      // Handle temporary conversations
      if (!isValidUUID(conversationId)) {
        // For temporary conversations, just add the message to the local state
        const newMessage = {
          id: `temp-${Date.now()}`,
          message,
          created_at: new Date().toISOString(),
          read: false,
          sender_id: userId,
          conversation_id: conversationId,
          receiver_id: 'temp-user'
        };
        
        setMessages(prev => [...prev, newMessage]);
        return;
      }
      
      // Handle real conversations
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);
        
      const receiver = participants?.find(p => p.user_id !== userId);
      if (!receiver) {
        throw new Error("Destinatário não encontrado");
      }
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          receiver_id: receiver.user_id,
          message: message,
          read: false
        });
        
      if (error) throw error;
        
      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
        
      // Fetch updated messages
      await fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
    }
  };

  return {
    messages,
    loading,
    fetchMessages,
    sendMessage,
    setMessages
  };
}
