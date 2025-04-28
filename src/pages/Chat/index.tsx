
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConversationList from "@/components/chat/ConversationList";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { NewConversationDialog } from "./components/NewConversationDialog";
import { ChatEmptyState } from "./components/ChatEmptyState";
import { useChatState } from "./hooks/useChatState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const { session, user, loading } = useAuth();
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
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Attempt to fetch real conversations from Supabase
        const { data, error } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching conversations:', error);
          setIsLoading(false);
          return;
        }
        
        if (data && data.length > 0) {
          // If we have real conversations, fetch their details
          const conversationIds = data.map(cp => cp.conversation_id);
          
          // For each conversation, get details, other user, last message
          // This is simplified - in a real app you'd likely use a join or function
          const conversationsWithDetails = [];
          
          for (const convId of conversationIds) {
            const { data: convData } = await supabase
              .from('conversations')
              .select('id, updated_at')
              .eq('id', convId)
              .single();
              
            if (convData) {
              // Get the other participant
              const { data: participants } = await supabase
                .from('conversation_participants')
                .select('user_id')
                .eq('conversation_id', convId)
                .neq('user_id', user.id);
                
              if (participants && participants.length > 0) {
                const otherUserId = participants[0].user_id;
                
                // Get other user details
                const { data: userData } = await supabase
                  .from('user_profiles')
                  .select('id, first_name, last_name')
                  .eq('id', otherUserId)
                  .single();
                  
                // Get last message
                const { data: messages } = await supabase
                  .from('chat_messages')
                  .select('message, created_at, sender_id, read')
                  .eq('conversation_id', convId)
                  .order('created_at', { ascending: false })
                  .limit(1);
                  
                let lastMessage = null;
                if (messages && messages.length > 0) {
                  lastMessage = {
                    message: messages[0].message,
                    created_at: messages[0].created_at,
                    is_read: messages[0].read,
                    is_mine: messages[0].sender_id === user.id
                  };
                }
                
                conversationsWithDetails.push({
                  id: convData.id,
                  updated_at: convData.updated_at,
                  otherUser: userData,
                  lastMessage
                });
              }
            }
          }
          
          setConversations(conversationsWithDetails);
        }
      } catch (e) {
        console.error('Error in conversation fetching:', e);
      } finally {
        setIsLoading(false);
      }
    };

    if (session && user) {
      fetchConversations();
    }
  }, [session, user, setConversations, setIsLoading]);

  const handleCreateConversation = async () => {
    if (!newConversationName.trim()) {
      toast({
        title: "Nome necessário",
        description: "Por favor, digite o nome do usuário para iniciar a conversa",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma conversa",
        variant: "destructive"
      });
      return;
    }

    try {
      const names = newConversationName.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      // In a real implementation, you would:
      // 1. Find or create the user with this name
      // 2. Create a conversation
      // 3. Add both users as participants
      
      // For now, we'll create a temporary ID
      const newId = `new-${Date.now()}`;
      
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
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar conversa",
        variant: "destructive"
      });
    }
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
