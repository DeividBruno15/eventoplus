
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NoCompatibleServicesProps {
  eventType: string;
}

export const NoCompatibleServices = ({ eventType }: NoCompatibleServicesProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-4">
      <p className="text-amber-600 mb-4">
        Você precisa cadastrar serviços compatíveis antes de se candidatar a eventos.
        {eventType && (
          <span className="block mt-2">
            Este evento requer prestadores na categoria: <strong>{eventType}</strong>
          </span>
        )}
      </p>
      <Button onClick={() => navigate('/profile')}>
        Configurar meus serviços
      </Button>
    </div>
  );
};
