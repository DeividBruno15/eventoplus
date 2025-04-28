
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
    const userId = user?.id || 'current-user';
    
    // Only create mock data if we explicitly have a temporary ID format
    if (id.startsWith('new-')) {
      // Extract the name from the ID or use a default
      const nameParts = id.split('-');
      const firstName = nameParts.length > 2 ? nameParts[1] : 'Unnamed';
      const lastName = nameParts.length > 3 ? nameParts[2] : 'User';
      
      return {
        otherUser: { first_name: firstName, last_name: lastName },
        messages: []
      };
    }
    
    return null;
  };

  const fetchMessages = async () => {
    if (!conversationId || !user) return;

    try {
      setLoading(true);
      
      // Handle mock conversations with non-UUID IDs
      if (!isValidUUID(conversationId)) {
        console.log('Using temporary conversation data');
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
      if (!user) {
        navigate('/login');
        return;
      }
      
      // For temporary conversations, use mock data
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
      // Handle temporary conversations
      if (!isValidUUID(conversationId)) {
        // For temporary conversations, just add the message to the local state
        const newMessage = {
          id: `temp-${Date.now()}`,
          message,
          created_at: new Date().toISOString(),
          read: false,
          sender_id: user.id,
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
    if (!conversationId) return;
    
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
            if (newMessage.sender_id !== user?.id) {
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
  }, [conversationId, user]);

  return {
    messages,
    loading,
    otherUser,
    sendMessage,
    fetchMessages
  };
}
