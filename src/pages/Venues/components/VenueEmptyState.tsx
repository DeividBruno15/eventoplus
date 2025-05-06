
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const VenueEmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-10 border rounded-lg bg-white">
      <div className="text-center max-w-md space-y-4">
        <h3 className="text-xl font-medium">Nenhum anúncio encontrado</h3>
        <p className="text-muted-foreground">
          Você ainda não tem nenhum anúncio cadastrado. Crie seu primeiro anúncio 
          para promover seu espaço para eventos.
        </p>
        <Button 
          onClick={() => navigate('/venues/create')}
          className="mt-4"
        >
          Criar meu primeiro anúncio
        </Button>
      </div>
    </div>
  );
};

export default VenueEmptyState;
