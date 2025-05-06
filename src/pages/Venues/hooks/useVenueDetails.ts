
import { useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VenueDetails } from '../types/venueDetailsTypes';

export const useVenueDetails = (id: string | undefined) => {
  const [venue, setVenue] = useState<VenueDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('venue_announcements')
          .select(`
            *,
            venue:venue_id(name, street, number, neighborhood, city, state, zipcode)
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setVenue(data as unknown as VenueDetails);
        
        if (data.available_dates && Array.isArray(data.available_dates)) {
          const dates = data.available_dates.map(dateStr => parseISO(dateStr));
          setSelectedDates(dates);
        }
      } catch (error) {
        console.error('Error fetching venue details:', error);
        toast.error('Falha ao carregar os detalhes do local');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVenueDetails();
  }, [id]);

  return { venue, loading, selectedDates };
};
