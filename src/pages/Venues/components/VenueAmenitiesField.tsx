
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { VenueFormValues } from "./VenueFormSchema";
import { FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";

const AMENITY_OPTIONS = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Estacionamento" },
  { id: "kitchen", label: "Cozinha" },
  { id: "sound_system", label: "Sistema de Som" },
  { id: "projector", label: "Projetor" },
  { id: "air_conditioning", label: "Ar Condicionado" },
  { id: "pool", label: "Piscina" },
  { id: "barbecue", label: "Churrasqueira" },
  { id: "accessibility", label: "Acessibilidade" },
  { id: "security", label: "Segurança" },
  { id: "catering", label: "Buffet Incluso" },
  { id: "tables_chairs", label: "Mesas e Cadeiras" },
];

const VenueAmenitiesField = () => {
  const { control, watch, setValue } = useFormContext<VenueFormValues>();
  const selectedAmenities = watch("amenities") || [];
  
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setValue(
        "amenities", 
        selectedAmenities.filter(item => item !== amenity)
      );
    } else {
      setValue("amenities", [...selectedAmenities, amenity]);
    }
  };
  
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-base font-medium">Comodidades</h3>
        <p className="text-sm text-muted-foreground">
          Selecione os serviços e facilidades disponíveis no seu espaço
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
        {AMENITY_OPTIONS.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`amenity-${option.id}`}
              checked={selectedAmenities.includes(option.id)}
              onCheckedChange={() => toggleAmenity(option.id)}
            />
            <label
              htmlFor={`amenity-${option.id}`}
              className="text-sm cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueAmenitiesField;
