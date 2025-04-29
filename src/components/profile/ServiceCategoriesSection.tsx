
import { Button } from "@/components/ui/button";

interface ServiceCategoriesSectionProps {
  onManageServices: () => void;
}

export const ServiceCategoriesSection = ({ onManageServices }: ServiceCategoriesSectionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium">Meus Serviços</h3>
          <Button 
            onClick={onManageServices}
            size="sm"
          >
            Gerenciar Serviços
          </Button>
        </div>

        <div className="text-muted-foreground text-sm">
          Gerencie os serviços que você oferece como prestador.
        </div>
      </div>
    </div>
  );
};
