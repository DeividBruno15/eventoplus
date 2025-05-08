
import { useFormContext } from "react-hook-form";
import { VenueFormValues } from "./VenueFormSchema";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const VenueRulesField = () => {
  const { control } = useFormContext<VenueFormValues>();
  
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-base font-medium">Regras do Local</h3>
        <p className="text-sm text-muted-foreground">
          Descreva as regras e informações importantes para os interessados
        </p>
      </div>
      
      <FormField
        control={control}
        name="rules"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Ex: Não é permitido fumar nas dependências do local. Música até 22h..."
                className="h-24 resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VenueRulesField;
