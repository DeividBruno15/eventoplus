
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUserPresence } from '@/hooks/chat/useUserPresence';

interface ConversationHeaderProps {
  otherUserName: string;
  otherUserInitials: string;
  otherUserId?: string;
}

export default function ConversationHeader({ 
  otherUserName, 
  otherUserInitials,
  otherUserId
}: ConversationHeaderProps) {
  const navigate = useNavigate();
  const { isOnline } = useUserPresence(otherUserId);

  return (
    <div className="p-4 border-b flex items-center bg-white">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate('/chat')}
        className="mr-3 hover:bg-gray-100"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center">
        <div className="relative">
          <Avatar className="bg-primary/10 text-primary w-10 h-10 mr-3">
            <AvatarFallback>{otherUserInitials}</AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-2 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <h3 className="font-medium">{otherUserName}</h3>
          <p className="text-xs text-gray-500">
            {isOnline ? "Online agora" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}
