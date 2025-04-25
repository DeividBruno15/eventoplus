
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ConversationHeader from '@/components/chat/ConversationHeader';
import Messages from '@/components/chat/Messages';
import MessageInput from '@/components/chat/MessageInput';
import EmptyState from '@/components/chat/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useConversation } from '@/hooks/useConversation';

export default function Conversation() {
  const { id } = useParams();
  const { user } = useAuth();
  const { messages, loading, otherUser, sendMessage, fetchMessages } = useConversation(id || '');

  // Fetch messages when the component mounts
  useEffect(() => {
    if (id) {
      fetchMessages();
    }
  }, [id, fetchMessages]);

  if (!id) {
    return <EmptyState />;
  }

  if (!otherUser) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh] overflow-hidden bg-white rounded-lg shadow">
      <Card className="flex flex-col flex-grow overflow-hidden border-0 shadow-none">
        <ConversationHeader 
          otherUserName={`${otherUser.first_name} ${otherUser.last_name}`}
          otherUserInitials={`${otherUser.first_name.charAt(0)}${otherUser.last_name.charAt(0)}`}
        />
        
        {loading ? (
          <div className="flex-grow flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Messages messages={messages} currentUserId={user?.id || ''} />
        )}
        
        <MessageInput onSendMessage={sendMessage} disabled={loading} />
      </Card>
    </div>
  );
}
