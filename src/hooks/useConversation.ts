
import { useEffect } from 'react';
import { Message } from '@/types/chat';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from './chat/useMessages';
import { useConversationValidation } from './chat/useConversationValidation';
import { useMessageSubscription } from './chat/useMessageSubscription';

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
  const { user } = useAuth();
  
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
    if (!conversationId) return;
    verifyConversation(fetchMessages);
  }, [conversationId, user]);

  return {
    messages,
    loading,
    otherUser,
    sendMessage,
    fetchMessages
  };
}
