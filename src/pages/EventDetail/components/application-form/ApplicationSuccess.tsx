
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const ApplicationSuccess = () => {
  const navigate = useNavigate();
  
  return (
    <CardContent className="pt-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-xl font-medium mb-2">Candidatura Enviada!</h3>
      <p className="text-muted-foreground mb-4">
        Sua candidatura foi enviada com sucesso e está aguardando análise do contratante.
      </p>
      <Button onClick={() => navigate('/events')}>
        Ver Outros Eventos
      </Button>
    </CardContent>
  );
};
