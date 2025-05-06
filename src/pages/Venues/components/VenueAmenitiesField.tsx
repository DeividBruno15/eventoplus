
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

const amenitiesList = [
  { id: "parking", label: "Estacionamento" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "restrooms", label: "Banheiros" },
  { id: "stage", label: "Palco" },
  { id: "aircon", label: "Ar-condicionado" },
  { id: "kitchen", label: "Cozinha" },
  { id: "sound", label: "Sistema de som" },
  { id: "lighting", label: "Iluminação" },
];

const VenueAmenitiesField = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="amenities"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>Comodidades</FormLabel>
            <FormDescription>
              Selecione os itens disponíveis no local
            </FormDescription>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenitiesList.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name="amenities"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </FormItem>
      )}
    />
  );
};

export default VenueAmenitiesField;
