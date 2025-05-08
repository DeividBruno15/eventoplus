
import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConversation } from '@/hooks/useConversation';
import { useAuth } from '@/hooks/useAuth';
import ConversationHeader from '@/components/chat/ConversationHeader';
import Messages from '@/components/chat/Messages';
import MessageInput from '@/components/chat/MessageInput';
import { Loader2 } from 'lucide-react';
import { useChatNotifications } from '@/pages/Chat/hooks/useChatNotifications';

export default function Conversation() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { sendMessageNotification } = useChatNotifications();
  
  // Se não houver ID da conversa, redireciona para a página de chat
  if (!conversationId) {
    navigate('/chat');
    return null;
  }

  const { 
    messages, 
    loading, 
    otherUser, 
    sendMessage: sendMessageToBackend 
  } = useConversation(conversationId);
  
  // Rolar para o final da conversa ao carregar novas mensagens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Função para enviar mensagens
  const handleSendMessage = async (content: string) => {
    try {
      await sendMessageToBackend(content);
      
      // Enviar notificação ao destinatário se ele existir e tiver um ID
      if (otherUser && user && otherUser.id) {
        await sendMessageNotification(
          otherUser.id,
          user.user_metadata?.first_name + ' ' + (user.user_metadata?.last_name || ''),
          content,
          conversationId
        );
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // Calcular as iniciais do outro usuário para o avatar
  const getOtherUserInitials = () => {
    if (!otherUser) return '';
    
    // Verifica se otherUser tem user_metadata (usuário do Supabase) ou acessa diretamente
    const firstName = otherUser.user_metadata?.first_name || otherUser.first_name || '';
    const lastName = otherUser.user_metadata?.last_name || otherUser.last_name || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Cabeçalho da conversa */}
      {otherUser && (
        <ConversationHeader
          otherUserName={`${otherUser.user_metadata?.first_name || otherUser.first_name || ''} ${otherUser.user_metadata?.last_name || otherUser.last_name || ''}`}
          otherUserInitials={getOtherUserInitials()}
        />
      )}
      
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <Messages messages={messages} currentUserId={user?.id} />
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input de mensagem */}
      <div className="p-4 border-t">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={loading || !otherUser}
        />
      </div>
    </div>
  );
}
