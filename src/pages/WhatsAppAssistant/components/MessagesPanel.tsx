
import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { WhatsAppMessage } from '@/types/whatsapp';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface MessagesPanelProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isSending: boolean;
  whatsappEnabled: boolean;
  phoneNumber: string | null;
}

export const MessagesPanel = ({
  messages,
  isLoading,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isSending,
  whatsappEnabled,
  phoneNumber
}: MessagesPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle>Mensagens</CardTitle>
        <CardDescription>Todas as suas conversas via WhatsApp</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          messagesEndRef={messagesEndRef}
        />
      </CardContent>
      
      <CardFooter className="pt-2">
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          isSending={isSending}
          isDisabled={!whatsappEnabled || !phoneNumber}
        />
      </CardFooter>
    </Card>
  );
};
