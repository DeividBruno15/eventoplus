
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/events';

/**
 * Hook para buscar eventos associados a um local específico
 * @param venueId ID do local para buscar eventos associados
 */
export const useVenueEvents = (venueId?: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!venueId) {
      setLoading(false);
      return;
    }

    const fetchVenueEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('events')
          .select(`
            id,
            name,
            description,
            event_date,
            location,
            max_attendees,
            contractor_id,
            user_id,
            contractor:contractor_id (
              id,
              first_name,
              last_name,
              avatar_url
            ),
            created_at,
            updated_at,
            service_type,
            status,
            event_time,
            image_url,
            zipcode,
            venue_id
          `)
          .eq('venue_id', venueId)
          .order('event_date', { ascending: true });

        if (error) throw error;
        
        setEvents(data || []);
      } catch (err: any) {
        console.error('Error fetching venue events:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchVenueEvents();
  }, [venueId]);

  return { events, loading, error };
};
