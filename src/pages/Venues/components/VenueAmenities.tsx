
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface VenueAmenitiesProps {
  amenities: string[];
}

// Mapping of amenity IDs to display names
const amenityLabels: Record<string, string> = {
  wifi: "WiFi",
  parking: "Estacionamento",
  kitchen: "Cozinha",
  sound_system: "Sistema de Som",
  projector: "Projetor",
  air_conditioning: "Ar Condicionado",
  pool: "Piscina",
  barbecue: "Churrasqueira",
  accessibility: "Acessibilidade",
  security: "Segurança",
  catering: "Buffet Incluso",
  tables_chairs: "Mesas e Cadeiras"
};

export const VenueAmenities = ({ amenities }: VenueAmenitiesProps) => {
  if (!amenities || amenities.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Comodidades</h2>
      
      <Card className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Check className="h-3 w-3" />
              </div>
              <span>{amenityLabels[amenity] || amenity}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
