
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const NoCompatibleServices = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-4">
      <p className="text-amber-600 mb-4">
        Você precisa cadastrar serviços compatíveis antes de se candidatar a eventos.
      </p>
      <Button onClick={() => navigate('/profile')}>
        Configurar meus serviços
      </Button>
    </div>
  );
};
