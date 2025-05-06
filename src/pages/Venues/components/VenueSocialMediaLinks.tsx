
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Instagram } from "lucide-react";
import { useFormContext } from "react-hook-form";

const VenueSocialMediaLinks = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Redes Sociais</h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="social_instagram"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                  <Instagram className="h-4 w-4" />
                </span>
                <FormLabel>Instagram</FormLabel>
              </div>
              <FormControl>
                <Input 
                  placeholder="https://instagram.com/seu_perfil" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="external_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link externo</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://..." 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Link para um site ou página com mais informações
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VenueSocialMediaLinks;
