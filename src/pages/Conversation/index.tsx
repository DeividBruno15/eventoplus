
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ConversationHeader } from '@/components/chat/ConversationHeader';
import { Messages } from '@/components/chat/Messages';
import { MessageInput } from '@/components/chat/MessageInput';
import { useConversation } from '@/hooks/useConversation';

const Conversation = () => {
  const { id } = useParams<{ id: string }>();
  const { messages, loading, error, sendMessage } = useConversation(id || '');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Scroll to bottom when component mounts or messages update
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    try {
      await sendMessage(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar a conversa: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader conversationId={id || ''} />
      <div className="flex-grow overflow-auto p-4 bg-slate-50" id="messages-container">
        <Messages messages={messages} loading={loading} />
      </div>
      <div className="p-4 bg-white border-t">
        <MessageInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSubmit={handleSendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Conversation;
