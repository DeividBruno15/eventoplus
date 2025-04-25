import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import ConversationList from "@/components/chat/ConversationList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { NewConversationDialog } from "./components/NewConversationDialog";
import { ChatEmptyState } from "./components/ChatEmptyState";
import { useChatState } from "./hooks/useChatState";

const Chat = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    conversations,
    setConversations,
    isLoading,
    setIsLoading,
    searchQuery,
    newConversationOpen,
    setNewConversationOpen,
    newConversationName,
    setNewConversationName,
    filteredConversations,
    handleSearchChange,
  } = useChatState();

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      setTimeout(() => {
        // Simulação de carregamento de conversas
        setConversations([
          {
            id: "1",
            updated_at: new Date().toISOString(),
            otherUser: {
              id: "user1",
              first_name: "Maria",
              last_name: "Silva"
            },
            lastMessage: {
              message: "Olá, gostaria de saber mais sobre seus serviços",
              created_at: new Date(Date.now() - 25 * 60000).toISOString(),
              is_read: false,
              is_mine: false
            }
          },
          {
            id: "2",
            updated_at: new Date(Date.now() - 60 * 60000).toISOString(),
            otherUser: {
              id: "user2",
              first_name: "João",
              last_name: "Santos"
            },
            lastMessage: {
              message: "Tudo confirmado para o evento",
              created_at: new Date(Date.now() - 60 * 60000).toISOString(),
              is_read: true,
              is_mine: true
            }
          },
          {
            id: "3",
            updated_at: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
            otherUser: {
              id: "user3",
              first_name: "Ana",
              last_name: "Pereira"
            },
            lastMessage: {
              message: "Você pode enviar um orçamento atualizado?",
              created_at: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
              is_read: true,
              is_mine: false
            }
          }
        ]);
        setIsLoading(false);
      }, 1000);
    };

    if (session) {
      fetchConversations();
    }
  }, [session, setConversations, setIsLoading]);

  const handleCreateConversation = () => {
    if (!newConversationName.trim()) {
      toast({
        title: "Nome necessário",
        description: "Por favor, digite o nome do usuário para iniciar a conversa",
        variant: "destructive"
      });
      return;
    }

    const newId = `new-${Date.now()}`;
    const names = newConversationName.split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    const newConversation = {
      id: newId,
      updated_at: new Date().toISOString(),
      otherUser: {
        id: `user-${Date.now()}`,
        first_name: firstName,
        last_name: lastName
      },
      lastMessage: null
    };

    setConversations([newConversation, ...conversations]);
    setNewConversationOpen(false);
    setNewConversationName("");
    navigate(`/chat/${newId}`);
    
    toast({
      title: "Conversa criada",
      description: `Conversa iniciada com ${newConversationName}`
    });
  };

  if (loading || !session) {
    navigate('/login');
    return null;
  }

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mensagens</h2>
        <Button 
          size="sm" 
          className="gap-2" 
          onClick={() => setNewConversationOpen(true)}
        >
          <MessageSquare className="h-4 w-4" />
          Nova Conversa
        </Button>
      </div>
      
      {conversations.length > 0 ? (
        <ConversationList 
          loading={isLoading} 
          conversations={conversations} 
          filteredConversations={filteredConversations} 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
        />
      ) : (
        <div className="flex-1">
          <ChatEmptyState />
        </div>
      )}
      
      <NewConversationDialog
        open={newConversationOpen}
        onOpenChange={setNewConversationOpen}
        conversationName={newConversationName}
        onConversationNameChange={setNewConversationName}
        onCreateConversation={handleCreateConversation}
      />
    </Card>
  );
};

export default Chat;
