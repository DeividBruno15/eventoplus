
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface ConversationDetails {
  otherUser: {
    first_name: string;
    last_name: string;
  } | null;
  messages: Message[];
  loading: boolean;
}

export function useConversation(conversationId: string): ConversationDetails & {
  sendMessage: (message: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
} {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<{ first_name: string; last_name: string; } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to check if id is a valid UUID
  const isValidUUID = (id: string) => {
    if (!id) return false;
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(id);
  };

  // For demo/mock conversations with numeric IDs
  const getMockConversation = (id: string) => {
    // Mock conversation data for demo purposes
    const mockConversations = {
      '1': {
        otherUser: { first_name: 'Maria', last_name: 'Silva' },
        messages: [
          { id: '1', message: 'Olá, gostaria de saber mais detalhes sobre seu serviço', created_at: new Date(Date.now() - 60 * 60000).toISOString(), read: true, sender_id: 'other-user' },
          { id: '2', message: 'Claro! Como posso ajudar?', created_at: new Date(Date.now() - 50 * 60000).toISOString(), read: true, sender_id: user?.id || '' }
        ]
      },
      '2': {
        otherUser: { first_name: 'João', last_name: 'Santos' },
        messages: [
          { id: '3', message: 'Você está disponível para um evento no próximo final de semana?', created_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(), read: true, sender_id: 'other-user' },
          { id: '4', message: 'Sim, estou disponível. Que horas seria?', created_at: new Date(Date.now() - 1 * 60 * 60000).toISOString(), read: true, sender_id: user?.id || '' }
        ]
      },
      '3': {
        otherUser: { first_name: 'Ana', last_name: 'Pereira' },
        messages: [
          { id: '5', message: 'Obrigada pelo orçamento', created_at: new Date(Date.now() - 24 * 60 * 60000).toISOString(), read: true, sender_id: 'other-user' },
          { id: '6', message: 'De nada! Se precisar de mais informações, estou à disposição.', created_at: new Date(Date.now() - 23 * 60 * 60000).toISOString(), read: true, sender_id: user?.id || '' }
        ]
      }
    } as Record<string, { otherUser: any, messages: any[] }>;
    
    return mockConversations[id] || null;
  };

  const fetchMessages = async () => {
    if (!conversationId || !user) return;

    try {
      setLoading(true);
      
      // Handle mock conversations with non-UUID IDs
      if (!isValidUUID(conversationId)) {
        console.log('Using mock conversation data for demo purposes');
        const mockData = getMockConversation(conversationId);
        
        if (mockData) {
          setOtherUser(mockData.otherUser);
          setMessages(mockData.messages);
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
          !msg.read && msg.sender_id !== user.id
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

  const verifyConversation = async () => {
    try {
      // For mock data, use the mock conversation data
      if (!isValidUUID(conversationId)) {
        const mockData = getMockConversation(conversationId);
        if (mockData) {
          setOtherUser(mockData.otherUser);
          await fetchMessages();
          return;
        }
        
        // If no mock data found, navigate to chat
        navigate('/chat');
        toast({
          title: "Conversa não encontrada",
          description: "A conversa solicitada não existe",
          variant: "destructive"
        });
        return;
      }
      
      // For real data, verify conversation exists and structure
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', conversationId)
        .single();
        
      if (!conversation) {
        navigate('/chat');
        toast({
          title: "Conversa não encontrada",
          description: "A conversa solicitada não existe",
          variant: "destructive"
        });
        return;
      }
      
      // Get conversation participants
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);
        
      if (!participants?.length) {
        navigate('/chat');
        toast({
          title: "Conversa inválida",
          description: "Esta conversa não tem participantes",
          variant: "destructive"
        });
        return;
      }
      
      const isParticipant = participants.some(p => p.user_id === user?.id);
      if (!isParticipant) {
        navigate('/chat');
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta conversa",
          variant: "destructive"
        });
        return;
      }
      
      // Get other participant's details
      const otherParticipant = participants.find(p => p.user_id !== user?.id);
      if (!otherParticipant) {
        navigate('/chat');
        return;
      }
      
      const { data: otherUserData } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', otherParticipant.user_id)
        .single();
        
      if (otherUserData) {
        setOtherUser(otherUserData);
      }
      
      // Fetch messages
      fetchMessages();
    } catch (error) {
      console.error('Error loading conversation details:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da conversa",
        variant: "destructive"
      });
      navigate('/chat');
    }
  };

  const sendMessage = async (message: string) => {
    if (!conversationId || !user) return;
    
    try {
      // Handle mock conversations
      if (!isValidUUID(conversationId)) {
        // For mock conversations, just add the message to the local state
        const newMessage = {
          id: `mock-${Date.now()}`,
          message,
          created_at: new Date().toISOString(),
          read: false,
          sender_id: user.id
        };
        
        setMessages([...messages, newMessage]);
        return;
      }
      
      // Handle real conversations
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);
        
      const receiver = participants?.find(p => p.user_id !== user.id);
      if (!receiver) {
        throw new Error("Destinatário não encontrado");
      }
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    verifyConversation();

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
            if (newMessage.sender_id !== user.id) {
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
  }, [conversationId, user, navigate]);

  return {
    messages,
    loading,
    otherUser,
    sendMessage,
    fetchMessages
  };
}
