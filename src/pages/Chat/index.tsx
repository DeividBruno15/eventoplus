
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Plus } from "lucide-react";
import ConversationList from "@/components/chat/ConversationList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useChatState } from "./hooks/useChatState";
import { ChatEmptyState } from "./components/ChatEmptyState";
import { NewConversationDialog } from "./components/NewConversationDialog";

const Chat = () => {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [conversationName, setConversationName] = useState("");
  const {
    conversations,
    filteredConversations,
    searchQuery,
    isLoading,
    handleSearchChange,
  } = useChatState();

  if (!session) {
    navigate('/login');
    return null;
  }

  const handleCreateConversation = () => {
    // Implement conversation creation logic
    toast({
      title: "Conversa criada",
      description: `Nova conversa iniciada com ${conversationName}`,
    });
    setIsDialogOpen(false);
    setConversationName("");
  };

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
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Buscar conversa..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-auto py-2">
            <ConversationList
              loading={isLoading}
              conversations={conversations}
              filteredConversations={filteredConversations}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </CardContent>
          
          <div className="p-4 mt-auto">
            <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nova conversa
            </Button>
          </div>
        </Card>
        
        <Card className="lg:col-span-2 h-[calc(100vh-15rem)] flex flex-col">
          <ChatEmptyState onNewMessage={() => setIsDialogOpen(true)} />
        </Card>
      </div>

      <NewConversationDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        conversationName={conversationName}
        onConversationNameChange={setConversationName}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
};

export default Chat;
