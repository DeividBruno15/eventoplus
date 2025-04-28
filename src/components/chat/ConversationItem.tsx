
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types/chat';
import { formatTime } from './utils';
import { toast } from '@/hooks/use-toast';

interface ConversationItemProps {
  conversation: Conversation;
}

export default function ConversationItem({ conversation: conv }: ConversationItemProps) {
  const navigate = useNavigate();

  const handleConversationClick = (id: string) => {
    try {
      // Fixed navigation path to be /conversation/[id]
      navigate(`/conversation/${id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Erro",
        description: "Erro ao abrir a conversa",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start px-4 py-6 h-auto hover:bg-muted/50"
      onClick={() => handleConversationClick(conv.id)}
    >
      <div className="flex items-start w-full">
        <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
          {conv.otherUser.first_name.charAt(0)}
          {conv.otherUser.last_name.charAt(0)}
        </div>
        
        <div className="ml-4 flex-grow overflow-hidden">
          <div className="flex justify-between mb-1">
            <span className="font-medium text-sm">
              {conv.otherUser.first_name} {conv.otherUser.last_name}
            </span>
            {conv.lastMessage && (
              <span className="text-xs text-muted-foreground">
                {formatTime(conv.lastMessage.created_at)}
              </span>
            )}
          </div>
          
          {conv.lastMessage ? (
            <p className={`text-sm truncate ${!conv.lastMessage.is_read && !conv.lastMessage.is_mine ? 'font-medium' : 'text-muted-foreground'}`}>
              {conv.lastMessage.is_mine && 'Você: '}
              {conv.lastMessage.message}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Nenhuma mensagem
            </p>
          )}
        </div>
        
        {conv.lastMessage && !conv.lastMessage.is_read && !conv.lastMessage.is_mine && (
          <div className="bg-primary rounded-full w-2 h-2 flex-shrink-0 mt-2"></div>
        )}
      </div>
    </Button>
  );
}
