
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

interface ApprovedApplicationProps {
  className?: string;
}

export const ApprovedApplication = ({ className }: ApprovedApplicationProps) => {
  const navigate = useNavigate();
  
  return (
    <div className={className}>
      <Separator className="my-4" />
      <div className="text-center">
        <p className="font-medium text-green-600 mb-2">
          Parabéns! Sua candidatura foi aprovada.
        </p>
        <Button 
          onClick={() => navigate('/chat')}
          className="mt-2"
        >
          Conversar com o contratante
        </Button>
      </div>
    </div>
  );
};
