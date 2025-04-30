
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

interface ApprovedApplicationProps {
  className?: string;
  conversationId?: string;
}

export const ApprovedApplication = ({ className, conversationId }: ApprovedApplicationProps) => {
  const navigate = useNavigate();
  
  const handleChatNavigation = () => {
    if (conversationId) {
      navigate(`/chat/${conversationId}`);
    } else {
      navigate('/chat');
    }
  };
  
  return (
    <div className={className}>
      <Separator className="my-4" />
      <div className="text-center">
        <p className="font-medium text-green-600 mb-2">
          Parabéns! Sua candidatura foi aprovada.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Agora você pode conversar diretamente com o contratante para alinhar os detalhes do evento.
        </p>
        <Button 
          onClick={handleChatNavigation}
          className="mt-2"
        >
          Conversar com o contratante
        </Button>
      </div>
    </div>
  );
};
