
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface VenuePageHeaderProps {
  isAdvertiser: boolean;
}

const VenuePageHeader = ({ isAdvertiser }: VenuePageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isAdvertiser ? "Meus anúncios" : "Locais para eventos"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isAdvertiser
            ? "Gerencie seus anúncios de espaços para eventos"
            : "Encontre o local perfeito para o seu próximo evento"}
        </p>
      </div>
      {isAdvertiser && (
        <Link to="/venues/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Criar anúncio
          </Button>
        </Link>
      )}
    </div>
  );
};

export default VenuePageHeader;
