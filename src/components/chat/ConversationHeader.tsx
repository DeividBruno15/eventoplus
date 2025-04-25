
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ConversationHeaderProps {
  otherUserName: string;
  otherUserInitials: string;
}

export default function ConversationHeader({ otherUserName, otherUserInitials }: ConversationHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="p-4 border-b flex items-center bg-white">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate('/chat')}
        className="mr-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center">
        <Avatar className="bg-primary text-primary-foreground w-10 h-10 mr-3">
          <AvatarFallback>{otherUserInitials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{otherUserName}</h3>
        </div>
      </div>
    </div>
  );
}
