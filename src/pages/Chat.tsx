
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Search, MessageSquare, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Chat = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  if (!session) {
    navigate('/login');
    return null;
  }

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: "Maria Silva",
      lastMessage: "Olá, gostaria de saber mais detalhes sobre o evento.",
      time: "10:30",
      unread: 2,
      avatar: "MS"
    },
    {
      id: 2,
      name: "João Santos",
      lastMessage: "Confirmei minha presença no evento de amanhã.",
      time: "Ontem",
      unread: 0,
      avatar: "JS"
    },
    {
      id: 3,
      name: "Ana Pereira",
      lastMessage: "Obrigada pelas informações!",
      time: "Seg",
      unread: 0,
      avatar: "AP"
    },
    {
      id: 4,
      name: "Carlos Oliveira",
      lastMessage: "Preciso remarcar nossa reunião.",
      time: "Qui",
      unread: 1,
      avatar: "CO"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chat</h2>
        <p className="text-muted-foreground mt-2">
          Comunique-se com outros usuários da plataforma.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-[calc(100vh-15rem)] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Conversas</CardTitle>
            <CardDescription>
              Suas conversas recentes
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar conversa..." className="pl-10" />
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-auto py-2">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => navigate(`/chat/${conversation.id}`)}
                >
                  <Avatar className="h-10 w-10 border">
                    <div className="bg-primary text-white flex items-center justify-center h-full text-sm font-medium">
                      {conversation.avatar}
                    </div>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium truncate">{conversation.name}</p>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{conversation.unread}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          
          <div className="p-4 mt-auto">
            <Button className="w-full" onClick={() => navigate('/chat/new')}>
              <Plus className="mr-2 h-4 w-4" /> Nova conversa
            </Button>
          </div>
        </Card>
        
        <Card className="lg:col-span-2 h-[calc(100vh-15rem)] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-center h-20 text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-10 w-10 mx-auto mb-2" />
                Selecione uma conversa para começar
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex items-center justify-center text-muted-foreground text-center">
            <div>
              <p>Nenhuma conversa selecionada.</p>
              <p>Clique em uma conversa da lista ou inicie uma nova.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
