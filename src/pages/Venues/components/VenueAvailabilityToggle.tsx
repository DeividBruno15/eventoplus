
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

const VenueAvailabilityToggle = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="is_rentable"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Disponível para aluguel</FormLabel>
            <FormDescription>
              Ativar para mostrar que seu espaço está disponível para locação
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
  );
};

export default VenueAvailabilityToggle;
