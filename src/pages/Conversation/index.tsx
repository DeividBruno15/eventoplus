
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConversationHeader from '@/components/chat/ConversationHeader';
import Messages from '@/components/chat/Messages';
import MessageInput from '@/components/chat/MessageInput';
import { useConversation } from '@/hooks/useConversation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Conversation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, loading, otherUser, sendMessage } = useConversation(id || '');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Check if id is not a valid UUID format (for demo/mock conversations)
    if (id && !isValidUUID(id)) {
      console.log('Not a valid UUID format, this is likely a mock conversation');
    }
    
    // Scroll to bottom when component mounts or messages update
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages, id]);

  const isValidUUID = (uuid: string) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    await sendMessage(message);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!otherUser && !loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Conversa não encontrada ou você não tem permissão para acessá-la.</p>
      </div>
    );
  }

  const otherUserName = otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : '';
  const otherUserInitials = otherUser ? 
    `${otherUser.first_name.charAt(0)}${otherUser.last_name.charAt(0)}` : '';

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader 
        otherUserName={otherUserName} 
        otherUserInitials={otherUserInitials} 
      />
      <div className="flex-grow overflow-auto" id="messages-container">
        {user && <Messages messages={messages} currentUserId={user.id} />}
      </div>
      <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default Conversation;
