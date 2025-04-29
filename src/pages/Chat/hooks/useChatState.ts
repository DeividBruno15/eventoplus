
import { useState, useEffect } from 'react';
import { Conversation } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useChatState = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch conversations from Supabase
        // This is a simplified example - in a real app, you'd fetch from your API
        const { data, error } = await supabase
          .functions
          .invoke('get-conversations', {});
          
        if (error) throw error;
        
        if (data?.data) {
          setConversations(data.data);
        } else {
          setConversations([]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  // Filtered conversations based on search query
  const filteredConversations = conversations.filter((conv) => {
    const fullName = `${conv.otherUser.first_name} ${conv.otherUser.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           (conv.lastMessage?.message?.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return {
    conversations,
    setConversations,
    isLoading,
    setIsLoading,
    searchQuery,
    filteredConversations,
    handleSearchChange,
  };
};
