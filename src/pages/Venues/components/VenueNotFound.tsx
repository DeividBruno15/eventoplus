
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const VenueNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-muted rounded-full h-20 w-20 flex items-center justify-center mb-6">
        <span className="text-3xl">🔍</span>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Espaço não encontrado</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        O espaço que você está procurando não existe ou foi removido.
      </p>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Button onClick={() => navigate("/venues")}>
          Ver todos os espaços
        </Button>
      </div>
    </div>
  );
};
