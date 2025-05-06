
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversation";
import { Card } from "@/components/ui/card";
import MessageInput from "@/components/chat/MessageInput";
import Messages from "@/components/chat/Messages";
import ConversationHeader from "@/components/chat/ConversationHeader";
import { ChatEmptyState } from "../Chat/components/ChatEmptyState";

const Conversation = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const {
    messages,
    otherUser,
    loading,
    sendMessage,
  } = useConversation(id || "");

  useEffect(() => {
    console.log("Conversation component mounted with ID:", id);
    console.log("Loading state:", loading);
    console.log("Other user:", otherUser);
    console.log("Messages count:", messages.length);
    
    // Reset error state when conversation ID changes
    setError(null);
  }, [id, loading, otherUser, messages.length]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !user) return;
    
    try {
      await sendMessage(text);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Erro ao enviar mensagem. Tente novamente.");
    }
  };

  const otherUserName = otherUser
    ? `${otherUser.first_name} ${otherUser.last_name}`
    : "Usuário";
    
  const otherUserInitials = otherUser
    ? `${otherUser.first_name.charAt(0)}${otherUser.last_name.charAt(0)}`
    : "UN";

  if (!id || !user) {
    return <ChatEmptyState />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-xl font-medium mb-2">Oops! Ocorreu um erro.</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-t-2 border-primary rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chat</h2>
        <p className="text-muted-foreground mt-2">
          Conversa com {otherUserName}
        </p>
      </div>
      
      <Card className="flex flex-col h-[calc(100vh-15rem)]">
        <ConversationHeader
          otherUserName={otherUserName}
          otherUserInitials={otherUserInitials}
        />
        
        <Messages
          messages={messages}
          currentUserId={user.id}
        />
        
        <div className="p-4 border-t">
          <MessageInput
            onSendMessage={handleSendMessage}
            placeholder="Digite sua mensagem..."
          />
        </div>
      </Card>
    </div>
  );
};

export default Conversation;
