
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import ConversationList from '@/components/chat/ConversationList';
import { useAuth } from '@/hooks/useAuth';
import { useChatState } from './hooks/useChatState';
import { ChatEmptyState } from './components/ChatEmptyState';
import { CreateConversationDialog } from './components/CreateConversationDialog';

const ChatPage = () => {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { 
    conversations, 
    isLoading, 
    searchQuery, 
    filteredConversations,
    handleSearchChange
  } = useChatState();

  const handleCreateConversation = (userId: string, userName: string) => {
    // Logic is now handled in the CreateConversationDialog component
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chat</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-5 h-5 mr-2" /> Nova conversa
        </Button>
      </div>

      {filteredConversations.length === 0 && !isLoading && !searchQuery ? (
        <ChatEmptyState 
          openCreateDialog={() => setIsCreateDialogOpen(true)} 
          hasConversations={conversations.length > 0} 
        />
      ) : (
        <ConversationList
          loading={isLoading}
          conversations={conversations}
          filteredConversations={filteredConversations}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      )}

      <CreateConversationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
};

export default ChatPage;
