
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

export function useMessages(conversationId: string, userId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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
    if (!conversationId || !userId) {
      console.log('fetchMessages: ID da conversa ou ID do usuário não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Buscando mensagens para conversa:', conversationId);
      
      // Handle mock conversations with non-UUID IDs
      if (!isValidUUID(conversationId)) {
        console.log('Usando dados temporários para conversa não-UUID');
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
        
      if (error) {
        console.error('Erro ao buscar mensagens:', error);
        throw error;
      }
      
      if (data) {
        console.log(`${data.length} mensagens encontradas`);
        setMessages(data);
        
        // Mark unread messages as read
        const unreadMessages = data.filter(msg => 
          !msg.read && msg.sender_id !== userId
        );
        
        if (unreadMessages?.length > 0) {
          console.log(`Marcando ${unreadMessages.length} mensagens como lidas`);
          await supabase
            .from('chat_messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      } else {
        console.log('Nenhuma mensagem encontrada');
        setMessages([]);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
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
    if (!conversationId || !userId) {
      console.log('sendMessage: ID da conversa ou ID do usuário não fornecido');
      return;
    }
    
    try {
      console.log('Enviando mensagem para conversa:', conversationId);
      
      // Handle temporary conversations
      if (!isValidUUID(conversationId)) {
        console.log('Adicionando mensagem temporária para conversa não-UUID');
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
      
      console.log('Buscando participantes da conversa');
      
      // Handle real conversations
      const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);
        
      if (participantsError) {
        console.error('Erro ao buscar participantes:', participantsError);
        throw participantsError;
      }
      
      const receiver = participants?.find(p => p.user_id !== userId);
      if (!receiver) {
        console.error('Destinatário não encontrado');
        throw new Error("Destinatário não encontrado");
      }
      
      console.log('Inserindo mensagem no banco de dados');
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          receiver_id: receiver.user_id,
          message: message,
          read: false
        })
        .select();
        
      if (error) {
        console.error('Erro ao inserir mensagem:', error);
        throw error;
      }
      
      console.log('Mensagem enviada com sucesso:', data);
        
      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
        
      // Fetch updated messages
      await fetchMessages();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    setMessages
  };
}
