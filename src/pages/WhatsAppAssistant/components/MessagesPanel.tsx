
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, AlertTriangle } from 'lucide-react';
import { WhatsAppMessage } from '@/types/whatsapp';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MessagesPanelProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isSending: boolean;
  whatsappEnabled: boolean;
  phoneNumber: string | null;
}

export function MessagesPanel({
  messages,
  isLoading,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isSending,
  whatsappEnabled,
  phoneNumber
}: MessagesPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatMessageTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM, HH:mm', { locale: ptBR });
    } catch (e) {
      return '';
    }
  };

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader className="border-b px-4 py-3">
        <h3 className="text-lg font-medium">Mensagens WhatsApp</h3>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M8 13h8"></path>
                <path d="M8 17h8"></path>
                <path d="M8 9h2"></path>
              </svg>
            </div>
            <h4 className="text-lg font-medium mb-2">Sem mensagens</h4>
            <p className="text-muted-foreground">
              Envie uma mensagem pelo WhatsApp para começar uma conversa ou use o campo abaixo para enviar uma mensagem.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.direction === 'outbound' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.direction === 'outbound'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                  <div
                    className={`text-xs mt-1 ${
                      msg.direction === 'outbound'
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatMessageTime(msg.created_at)}
                    {msg.is_auto_reply && ' · Resposta automática'}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        {!whatsappEnabled || !phoneNumber ? (
          <Alert className="w-full">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {!phoneNumber ? (
                'Adicione um número de WhatsApp para enviar mensagens'
              ) : (
                'Ative as notificações de WhatsApp para enviar mensagens'
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isSending}
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim() || isSending}>
              {isSending ? (
                <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        )}
      </CardFooter>
    </Card>
  );
}
