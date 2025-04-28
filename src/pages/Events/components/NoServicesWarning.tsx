
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NoServicesWarning = () => {
  const navigate = useNavigate();
  
  const handleAddServices = () => {
    // Redirecionar para a página de configurações onde podem adicionar serviços
    navigate('/settings');
  };
  
  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="pt-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-medium">Você não possui serviços cadastrados</h3>
            <p className="text-sm text-muted-foreground">
              Para visualizar eventos compatíveis, é necessário cadastrar os serviços que você oferece.
            </p>
            <Button onClick={handleAddServices} variant="default" className="mt-2">
              Adicionar Serviços
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
