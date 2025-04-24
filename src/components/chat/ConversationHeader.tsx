
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConversationHeaderProps {
  otherUserName: string;
  otherUserInitials: string;
}

export default function ConversationHeader({ otherUserName, otherUserInitials }: ConversationHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="p-4 border-b flex items-center">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate('/chat')}
        className="mr-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center">
        <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mr-3">
          {otherUserInitials}
        </div>
        <div>
          <h3 className="font-medium">{otherUserName}</h3>
        </div>
      </div>
    </div>
  );
}
