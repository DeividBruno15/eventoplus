
import { useState } from 'react';
import { Conversation } from '@/types/chat';

export const useChatState = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [newConversationName, setNewConversationName] = useState("");

  // Filtered conversations based on search query
  const filteredConversations = conversations.filter((conv) => {
    const fullName = `${conv.otherUser.first_name} ${conv.otherUser.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           (conv.lastMessage?.message.toLowerCase().includes(searchQuery.toLowerCase()));
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
    setSearchQuery,
    newConversationOpen,
    setNewConversationOpen,
    newConversationName,
    setNewConversationName,
    filteredConversations,
    handleSearchChange,
  };
};
