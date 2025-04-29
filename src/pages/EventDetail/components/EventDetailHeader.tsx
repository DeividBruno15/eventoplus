
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/events';

interface EventDetailHeaderProps {
  loading: boolean;
  event: Event | null;
}

export const EventDetailHeader = ({ loading, event }: EventDetailHeaderProps) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Card className="text-center py-16">
          <CardContent>
            <h3 className="text-xl font-medium mb-2">Evento não encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Este evento pode ter sido removido ou você não tem permissão para acessá-lo.
            </p>
            <Button onClick={() => navigate('/events')}>
              Voltar para eventos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return null;
};
