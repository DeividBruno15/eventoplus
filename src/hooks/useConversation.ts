
import { useEffect, useState } from 'react';
import { Message, User } from '@/types/chat';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from './chat/useMessages';
import { useConversationValidation } from './chat/useConversationValidation';
import { useMessageSubscription } from './chat/useMessageSubscription';

interface ConversationDetails {
  otherUser: User | null;
  messages: Message[];
  loading: boolean;
}

export function useConversation(conversationId: string): ConversationDetails & {
  sendMessage: (message: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
} {
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);
  
  // Get message-related functions
  const { 
    messages, 
    loading, 
    fetchMessages, 
    sendMessage 
  } = useMessages(conversationId, user?.id);
  
  // Get conversation validation functions
  const { 
    otherUser, 
    verifyConversation 
  } = useConversationValidation(conversationId, user?.id);
  
  // Set up message subscription
  useMessageSubscription(conversationId, user?.id, fetchMessages);
  
  // Verify conversation when component mounts
  useEffect(() => {
    console.log('useConversation effect:', conversationId, user?.id, initialized);
    
    if (!conversationId || !user?.id || initialized) return;
    
    const initialize = async () => {
      console.log('Inicializando conversa...');
      await verifyConversation(fetchMessages);
      setInitialized(true);
    };
    
    initialize();
  }, [conversationId, user?.id]);

  return {
    messages,
    loading: loading || !initialized,
    otherUser,
    sendMessage,
    fetchMessages
  };
}
