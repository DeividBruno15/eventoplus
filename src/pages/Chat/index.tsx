
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import ConversationList from "@/components/chat/ConversationList";
import EmptyState from "@/components/chat/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Conversation } from "@/types/chat";
import { Loader2, MessageCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Chat = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [newConversationName, setNewConversationName] = useState("");
  const { toast } = useToast();
  
  // Filtered conversations based on search query
  const filteredConversations = conversations.filter((conv) => {
    const fullName = `${conv.otherUser.first_name} ${conv.otherUser.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           (conv.lastMessage?.message.toLowerCase().includes(searchQuery.toLowerCase()));
  });
  
  useEffect(() => {
    const fetchConversations = async () => {
      // Simulação de carregamento de conversas
      setIsLoading(true);
      setTimeout(() => {
        // Dados simulados
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
              created_at: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutos atrás
              is_read: false,
              is_mine: false
            }
          },
          {
            id: "2",
            updated_at: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hora atrás
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
            updated_at: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 dia atrás
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
  }, [session]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    navigate('/login');
    return null;
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewConversation = () => {
    setNewConversationOpen(true);
  };

  const handleCreateConversation = () => {
    if (!newConversationName.trim()) {
      toast({
        title: "Nome necessário",
        description: "Por favor, digite o nome do usuário para iniciar a conversa",
        variant: "destructive"
      });
      return;
    }

    // Simular criação de conversa
    const newId = `new-${Date.now()}`;
    const names = newConversationName.split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    const newConversation: Conversation = {
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

    // Navega para a nova conversa
    navigate(`/chat/${newId}`);
    
    toast({
      title: "Conversa criada",
      description: `Conversa iniciada com ${newConversationName}`
    });
  };

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mensagens</h2>
        <Button size="sm" className="gap-2" onClick={handleNewConversation}>
          <MessageCircle className="h-4 w-4" />
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
        <EmptyState 
          totalConversations={0}
          title="Nenhuma conversa encontrada" 
          description="Você ainda não tem nenhuma conversa iniciada." 
          icon={<MessageCircle className="h-12 w-12 text-muted-foreground" />}
        />
      )}
      
      {/* Modal para nova conversa */}
      <Dialog open={newConversationOpen} onOpenChange={setNewConversationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Conversa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="recipient" className="text-sm font-medium mb-2 block">
                Nome do destinatário
              </label>
              <Input 
                id="recipient" 
                placeholder="Digite o nome do usuário"
                value={newConversationName}
                onChange={(e) => setNewConversationName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleCreateConversation}>
              Iniciar Conversa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Chat;
