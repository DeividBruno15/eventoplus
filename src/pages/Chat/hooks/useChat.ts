
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage, UserProfile } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Buscar mensagens quando a conversa é alterada
  useEffect(() => {
    if (!conversationId || !user) return;
    
    const fetchMessagesAndParticipants = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Buscar mensagens
        const { data: messagesData, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
          
        if (messagesError) throw messagesError;

        // Buscar participantes da conversa
        const { data: participantsData, error: participantsError } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conversationId);
          
        if (participantsError) throw participantsError;

        // Encontrar o ID do outro usuário
        const otherUserId = participantsData
          .find(p => p.user_id !== user.id)?.user_id;
          
        if (otherUserId) {
          // Buscar detalhes do outro usuário
          const { data: userData, error: userError } = await supabase
            .from('user_profiles')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', otherUserId)
            .single();
            
          if (userError) {
            console.error('Erro ao buscar detalhes do usuário:', userError);
          } else {
            setOtherUser(userData);
          }
        }

        setMessages(messagesData || []);
      } catch (err: any) {
        console.error('Erro ao buscar mensagens:', err);
        setError('Não foi possível carregar as mensagens');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessagesAndParticipants();
    
    // Configurar escuta em tempo real para novas mensagens
    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        // Adicionar nova mensagem ao estado
        const newMessage = payload.new as ChatMessage;
        setMessages(prevMessages => [...prevMessages, newMessage]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const sendMessage = async (message: string) => {
    if (!conversationId || !user || !message.trim()) return false;
    
    try {
      const newMessage = {
        conversation_id: conversationId,
        sender_id: user.id,
        message: message.trim(),
        read: false
      };
      
      const { error } = await supabase
        .from('chat_messages')
        .insert(newMessage);
        
      if (error) throw error;
      
      return true;
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    otherUser
  };
};
