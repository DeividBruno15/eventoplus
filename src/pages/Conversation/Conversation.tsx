
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ConversationHeader } from "@/components/chat/ConversationHeader";
import { Messages } from "@/components/chat/Messages";
import { MessageInput } from "@/components/chat/MessageInput";
import { EmptyState } from "@/components/chat/EmptyState";
import { useConversation } from "@/hooks/useConversation";
import { Loader2 } from "lucide-react";

export const Conversation = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getMessages, 
    sendMessage, 
    loadingMessages, 
    messages, 
    otherUser 
  } = useConversation(id);
  
  useEffect(() => {
    if (id) {
      getMessages();
    }
  }, [id, getMessages]);
  
  if (loadingMessages) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  
  if (!id) {
    return <EmptyState />;
  }
  
  return (
    <div className="flex flex-col h-[80vh] overflow-hidden">
      <ConversationHeader user={otherUser} />
      <Messages messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default Conversation;
