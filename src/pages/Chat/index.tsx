
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import ConversationList from "@/components/chat/ConversationList";
import { useAuth } from "@/hooks/useAuth";
import { useChatState } from "./hooks/useChatState";
import ChatEmptyState from "./components/ChatEmptyState";
import { CreateConversationDialog } from "./components/CreateConversationDialog";
import { Input } from "@/components/ui/input";
import { Conversation } from "@/types/chat";

export default function Chat() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { conversations, loading, refreshConversations } = useChatState();

  // Filtrar conversas com base na pesquisa
  const filteredConversations = conversations.filter((conv: Conversation) => {
    const otherUser = conv.otherUser;
    const fullName = `${otherUser.first_name} ${otherUser.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Atualizar as conversas quando a página for carregada
  useEffect(() => {
    if (user) {
      refreshConversations();
    }
  }, [user]);

  // Atualizar conversas periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        refreshConversations();
      }
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, [user]);

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    // Atualizar a lista de conversas após criar uma nova
    refreshConversations();
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Conversas</h1>
        <Button onClick={handleOpenCreateDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Procurar conversa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {conversations.length === 0 && !loading ? (
        <ChatEmptyState onNewChat={handleOpenCreateDialog} />
      ) : (
        <ConversationList
          loading={loading}
          conversations={conversations}
          filteredConversations={filteredConversations}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <CreateConversationDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
      />
    </div>
  );
}
