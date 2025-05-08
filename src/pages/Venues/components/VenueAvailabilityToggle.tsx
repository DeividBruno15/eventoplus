
import { useFormContext } from "react-hook-form";
import { VenueFormValues } from "./VenueFormSchema";
import { FormField, FormItem, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const VenueAvailabilityToggle = () => {
  const { control } = useFormContext<VenueFormValues>();
  
  return (
    <div className="border p-4 rounded-md bg-muted/30">
      <FormField
        control={control}
        name="is_rentable"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div>
              <h3 className="font-medium">Disponível para reservas</h3>
              <FormDescription>
                Seu espaço estará disponível para solicitações de reserva
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default VenueAvailabilityToggle;
