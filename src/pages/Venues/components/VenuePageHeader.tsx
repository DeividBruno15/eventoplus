
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VenuePageHeaderProps {
  isAdvertiser: boolean;
}

const VenuePageHeader: React.FC<VenuePageHeaderProps> = ({ isAdvertiser }) => {
  const navigate = useNavigate();

  const handleCreateVenue = () => {
    navigate("/venues/create");
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">
          {isAdvertiser ? "Meus Anúncios" : "Encontre Espaços"}
        </h1>
        <p className="text-muted-foreground">
          {isAdvertiser
            ? "Gerencie seus espaços para eventos"
            : "Procure e reserve espaços para seus eventos"}
        </p>
      </div>

      <Button onClick={handleCreateVenue}>
        <Plus className="h-4 w-4 mr-2" />
        {isAdvertiser ? "Criar Anúncio" : "Anunciar meu espaço"}
      </Button>
    </div>
  );
};

export default VenuePageHeader;
