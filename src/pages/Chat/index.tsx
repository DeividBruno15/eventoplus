
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import ConversationList from "@/components/chat/ConversationList";
import EmptyState from "@/components/chat/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Conversation } from "@/types/chat";
import { Loader2, MessageCircle } from "lucide-react";

const Chat = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mensagens</h2>
        <Button size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Nova Conversa
        </Button>
      </div>
      
      {conversations.length > 0 ? (
        <ConversationList conversations={conversations} />
      ) : (
        <EmptyState 
          title="Nenhuma conversa encontrada" 
          description="Você ainda não tem nenhuma conversa iniciada." 
          icon={<MessageCircle className="h-12 w-12 text-muted-foreground" />}
        />
      )}
    </Card>
  );
};

export default Chat;
