
import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from '@/contexts/SessionContext';

export const OnboardingCard = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const { session } = useSession();
  const userProfile = session?.user?.user_metadata;

  // Check if any required fields are missing
  const missingFields = [
    !userProfile?.phone_number && 'telefone',
    !userProfile?.address && 'endereço',
    !userProfile?.document_number && 'documento',
  ].filter(Boolean);

  if (!isVisible || missingFields.length === 0) {
    return null;
  }

  return (
    <Card className="bg-primary/5 border-primary/20 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary">Complete seu cadastro</h3>
            <p className="text-muted-foreground mt-1">
              Para aproveitar todas as funcionalidades da plataforma, complete as informações do seu perfil:
              {' '}{missingFields.join(', ')}.
            </p>
            <Button 
              onClick={() => navigate('/profile')}
              className="mt-4"
              size="sm"
            >
              Completar Agora
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8" 
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
