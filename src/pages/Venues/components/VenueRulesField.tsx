
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

const VenueRulesField = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="rules"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Regras do local</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Ex: Não permitido animais, não é permitido colar itens nas paredes, etc." 
              className="min-h-24"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VenueRulesField;
