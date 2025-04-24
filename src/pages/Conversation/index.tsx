
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Messages from '@/components/chat/Messages';
import MessageInput from '@/components/chat/MessageInput';
import ConversationHeader from '@/components/chat/ConversationHeader';
import { useAuth } from '@/hooks/useAuth';
import { useConversation } from '@/hooks/useConversation';

export default function Conversation() {
  const { id } = useParams();
  const { user } = useAuth();
  const { messages, loading, otherUser, sendMessage } = useConversation(id || '');

  if (!otherUser) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="container mx-auto px-4 py-4 flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-4 flex-grow flex flex-col">
        <Card className="flex flex-col flex-grow overflow-hidden">
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
      <Footer />
    </div>
  );
}
