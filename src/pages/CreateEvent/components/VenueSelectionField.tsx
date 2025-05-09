
import { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { CreateEventFormData } from '@/types/events';

interface VenueSelectionFieldProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const VenueSelectionField = ({ form }: VenueSelectionFieldProps) => {
  const [venues, setVenues] = useState<Array<{id: string; name: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('venue_announcements')
          .select('id, title, venue_id')
          .eq('is_rentable', true);

        if (error) throw error;

        // Transform data for select component
        const venueOptions = data.map(venue => ({
          id: venue.venue_id,
          name: venue.title
        }));

        setVenues(venueOptions);
      } catch (error) {
        console.error('Error fetching venues:', error);
        toast.error('Não foi possível carregar os locais disponíveis');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleVenueSelection = async (venueId: string) => {
    try {
      if (!venueId) return;

      const { data, error } = await supabase
        .from('user_venues')
        .select('street, number, neighborhood, city, state, zipcode')
        .eq('id', venueId)
        .single();

      if (error) throw error;

      if (data) {
        // Update form fields with venue address
        form.setValue('street', data.street);
        form.setValue('number', data.number);
        form.setValue('neighborhood', data.neighborhood);
        form.setValue('city', data.city);
        form.setValue('state', data.state);
        form.setValue('zipcode', data.zipcode);
        
        // Armazenamos o venue_id no form, mas não será enviado para o banco
        form.setValue('venue_id', venueId);
      }
    } catch (error) {
      console.error('Error fetching venue details:', error);
    }
  };

  return (
    <FormField
      control={form.control}
      name="venue_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Local do Evento</FormLabel>
          <FormControl>
            <Select
              disabled={loading}
              onValueChange={(value) => {
                field.onChange(value);
                handleVenueSelection(value);
              }}
              value={field.value || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um local para o evento" />
              </SelectTrigger>
              <SelectContent>
                {venues.map(venue => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name}
                  </SelectItem>
                ))}
                {venues.length === 0 && !loading && (
                  <SelectItem value="" disabled>
                    Nenhum local disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
