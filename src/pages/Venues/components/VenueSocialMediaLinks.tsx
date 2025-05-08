
import { useFormContext } from "react-hook-form";
import { VenueFormValues } from "./VenueFormSchema";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const VenueSocialMediaLinks = () => {
  const { control } = useFormContext<VenueFormValues>();
  
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-base font-medium">Links e Redes Sociais</h3>
        <p className="text-sm text-muted-foreground">
          Adicione links para suas redes sociais (opcional)
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="external_link"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Site (https://seusite.com.br)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="social_instagram"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Instagram (@seu_perfil)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="social_facebook"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Facebook"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="social_twitter"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Twitter/X"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default VenueSocialMediaLinks;
