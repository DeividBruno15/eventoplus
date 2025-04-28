
import { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Map, MapPin } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { fetchLocationFromCEP } from "@/utils/cep";
import { toast } from "sonner";
import type { CreateEventFormData } from "../schema";
import { UseFormReturn } from "react-hook-form";

interface LocationServiceFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const LocationServiceFields = ({ form }: LocationServiceFieldsProps) => {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [zipcode, setZipcode] = useState("");
  
  const handleLocationSearch = useCallback(async () => {
    if (!zipcode || zipcode.length !== 8) {
      toast.error("Por favor, insira um CEP válido.");
      return;
    }

    setIsFetchingLocation(true);
    try {
      const locationData = await fetchLocationFromCEP(zipcode);
      if (locationData) {
        const formattedAddress = `${locationData.logradouro}, ${locationData.bairro}, ${locationData.localidade} - ${locationData.uf}`;
        form.setValue("location", formattedAddress);
        toast.success("Endereço encontrado com sucesso!");
      }
    } catch (error) {
      toast.error("Não foi possível encontrar o endereço a partir deste CEP.");
    } finally {
      setIsFetchingLocation(false);
    }
  }, [zipcode, form]);

  const debouncedZipcodeChange = useDebouncedCallback((value) => {
    const cleanValue = value.replace(/\D/g, "");
    setZipcode(cleanValue);
  }, 300);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location">Endereço do Evento*</Label>
        <div className="flex gap-2">
          <Input 
            id="cep"
            placeholder="CEP"
            className="w-32"
            maxLength={8}
            onChange={(e) => debouncedZipcodeChange(e.target.value)}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleLocationSearch}
            disabled={isFetchingLocation}
            className="flex-shrink-0"
          >
            <Map className="h-4 w-4 mr-2" />
            {isFetchingLocation ? "Buscando..." : "Buscar"}
          </Button>
        </div>
        <div className="relative">
          <MapPin className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Textarea 
            id="location"
            placeholder="Rua, número, bairro, cidade, estado"
            className="pl-10 min-h-[80px]"
            {...form.register('location')}
          />
        </div>
        {form.formState.errors.location && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
        )}
      </div>
    </div>
  );
};
