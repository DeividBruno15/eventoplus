
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ConversationHeader from "@/components/chat/ConversationHeader";
import Messages from "@/components/chat/Messages";
import MessageInput from "@/components/chat/MessageInput";
import EmptyState from "@/components/chat/EmptyState";
import { useConversation } from "@/hooks/useConversation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const Conversation = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { 
    fetchMessages, 
    sendMessage, 
    loading, 
    messages, 
    otherUser 
  } = useConversation(id || '');
  
  useEffect(() => {
    if (id) {
      fetchMessages();
    }
  }, [id, fetchMessages]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  
  if (!id || !otherUser) {
    return <EmptyState totalConversations={0} />;
  }
  
  return (
    <div className="flex flex-col h-[80vh] overflow-hidden">
      <ConversationHeader 
        otherUserName={`${otherUser.first_name} ${otherUser.last_name}`}
        otherUserInitials={`${otherUser.first_name.charAt(0)}${otherUser.last_name.charAt(0)}`}
      />
      <Messages messages={messages} currentUserId={user?.id || ''} />
      <MessageInput onSendMessage={sendMessage} disabled={loading} />
    </div>
  );
};

export default Conversation;
