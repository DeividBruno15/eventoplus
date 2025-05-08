
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Messages from '@/components/chat/Messages';
import MessageInput from '@/components/chat/MessageInput';
import ConversationHeader from '@/components/chat/ConversationHeader';
import { useChat } from '../hooks/useChat';
import { useMarkMessagesAsRead } from '@/hooks/chat/useMarkMessagesAsRead';
import { useChatNotifications } from '../hooks/useChatNotifications';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationSounds } from '@/hooks/useNotificationSounds';

const ConversationView = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const { playMessageSound } = useNotificationSounds();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    otherUser
  } = useChat(conversationId);

  const { sendMessageNotification } = useChatNotifications();

  // Marcar mensagens como lidas quando a conversa é aberta
  useMarkMessagesAsRead(conversationId);

  // Tocar som quando chega uma nova mensagem
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Se a última mensagem é de outra pessoa e é recente (menos de 5 segundos)
      if (
        lastMessage.sender_id !== user?.id &&
        new Date().getTime() - new Date(lastMessage.created_at).getTime() < 5000
      ) {
        playMessageSound();
      }
    }
  }, [messages, user, playMessageSound]);

  const handleSendMessage = async (content: string) => {
    if (!conversationId || !otherUser) return;
    
    // Enviar a mensagem
    const success = await sendMessage(content);
    
    // Se a mensagem foi enviada com sucesso, enviar notificação
    if (success) {
      sendMessageNotification(
        otherUser.id,
        user?.user_metadata?.name || 'Usuário',
        content,
        conversationId
      );
    }
  };

  if (!conversationId) return null;

  const otherUserInitials = otherUser ? 
    `${otherUser.first_name?.charAt(0) || ''}${otherUser.last_name?.charAt(0) || ''}` : 
    '';

  const otherUserName = otherUser ? 
    `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() : 
    'Usuário';

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader 
        otherUserName={otherUserName}
        otherUserInitials={otherUserInitials}
        otherUserId={otherUser?.id}
      />
      
      <div className="flex-1 overflow-hidden">
        <Messages 
          messages={messages}
          currentUserId={user?.id}
        />
      </div>
      
      <div className="p-4 border-t bg-white">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ConversationView;
