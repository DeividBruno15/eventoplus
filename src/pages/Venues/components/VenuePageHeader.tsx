
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VenuePageHeaderProps {
  isAdvertiser: boolean;
}

const VenuePageHeader = ({ isAdvertiser }: VenuePageHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">
          {isAdvertiser ? "Meus Anúncios" : "Locais de Eventos"}
        </h2>
        <p className="text-muted-foreground">
          {isAdvertiser 
            ? "Gerencie os anúncios dos seus espaços para eventos"
            : "Encontre os melhores locais para seus eventos"
          }
        </p>
      </div>
      {isAdvertiser && (
        <Button 
          onClick={() => navigate('/venues/create')}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Criar Anúncio
        </Button>
      )}
    </div>
  );
};

export default VenuePageHeader;
