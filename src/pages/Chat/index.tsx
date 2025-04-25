
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import ConversationList from "@/components/chat/ConversationList";
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
    
    // Use push instead of navigate to ensure a full navigation
    navigate(`/chat/${newId}`);
    
    toast({
      title: "Conversa criada",
      description: `Conversa iniciada com ${newConversationName}`
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  if (!session) {
    navigate('/login');
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chat</h2>
        <p className="text-muted-foreground mt-2">
          Comunique-se com outros usuários da plataforma.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col h-[calc(100vh-15rem)]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Conversas</h3>
              <Button 
                size="sm" 
                className="gap-2" 
                onClick={() => setNewConversationOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
                Nova
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ConversationList 
                loading={isLoading} 
                conversations={conversations} 
                filteredConversations={filteredConversations} 
                searchQuery={searchQuery} 
                onSearchChange={handleSearchChange} 
              />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <ChatEmptyState />
        </div>
      </div>
      
      <NewConversationDialog
        open={newConversationOpen}
        onOpenChange={setNewConversationOpen}
        conversationName={newConversationName}
        onConversationNameChange={setNewConversationName}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
};

export default Chat;
