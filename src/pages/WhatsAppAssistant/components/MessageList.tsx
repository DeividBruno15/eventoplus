
import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WhatsAppMessage } from '@/types/whatsapp';

interface MessageListProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList = ({ messages, isLoading, messagesEndRef }: MessageListProps) => {
  const formatMessageDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), {
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="bg-muted rounded-full p-4 mb-4">
          <Send className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">Nenhuma mensagem</h3>
        <p className="text-center text-muted-foreground max-w-md">
          Inicie uma conversa enviando uma mensagem. Nosso assistente responderá via WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-4 py-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.direction === 'outbound'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary'
              } ${message.sending ? 'opacity-70' : ''}`}
            >
              <p>{message.message}</p>
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${message.direction === 'outbound' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {formatMessageDate(message.created_at)}
                </span>
                {message.is_auto_reply && (
                  <span className="text-xs ml-2 bg-primary-foreground/20 px-1 rounded text-primary-foreground">Auto</span>
                )}
                {message.sending && (
                  <span className="text-xs ml-2 animate-pulse">enviando...</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
