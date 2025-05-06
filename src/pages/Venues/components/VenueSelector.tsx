
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";

export interface Venue {
  id: string;
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
}

interface VenueSelectorProps {
  onVenueSelection: (venueId: string) => void;
}

const VenueSelector: React.FC<VenueSelectorProps> = ({ onVenueSelection }) => {
  const { user } = useAuth();
  const form = useFormContext();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  
  useEffect(() => {
    const fetchUserVenues = async () => {
      if (!user) return;
      
      try {
        setIsLoadingVenues(true);
        const { data, error } = await supabase
          .from("user_venues")
          .select("id, name, street, number, neighborhood, city, state, zipcode")
          .eq("user_id", user.id)
          .order("name");
          
        if (error) throw error;
        
        setVenues(data || []);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setIsLoadingVenues(false);
      }
    };
    
    fetchUserVenues();
  }, [user]);
  
  return (
    <FormField
      control={form.control}
      name="venue_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Local</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onVenueSelection(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um local cadastrado" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoadingVenues ? (
                <SelectItem value="loading" disabled>
                  Carregando locais...
                </SelectItem>
              ) : venues.length > 0 ? (
                venues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name} ({venue.street}, {venue.number})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  Nenhum local cadastrado
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormDescription>
            Selecione um local cadastrado ou adicione um novo em seu perfil.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VenueSelector;
