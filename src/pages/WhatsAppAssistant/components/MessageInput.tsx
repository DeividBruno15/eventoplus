
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (e: FormEvent) => void;
  isSending: boolean;
  isDisabled: boolean;
}

export const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  isSending,
  isDisabled
}: MessageInputProps) => {
  return (
    <form onSubmit={handleSendMessage} className="w-full flex gap-2">
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        className="flex-1"
        disabled={isSending || isDisabled}
      />
      <Button type="submit" disabled={isSending || !newMessage.trim() || isDisabled}>
        {isSending ? (
          <div className="h-4 w-4 border-t-2 border-r-2 rounded-full animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};
