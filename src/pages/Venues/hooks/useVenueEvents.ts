
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
        
        // Transform the data to match the Event type
        const formattedEvents: Event[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          event_date: item.event_date,
          location: item.location,
          max_attendees: item.max_attendees,
          contractor_id: item.contractor_id,
          user_id: item.user_id,
          // Use type assertion to handle the contractor object correctly
          contractor: item.contractor ? {
            id: (item.contractor as any).id,
            first_name: (item.contractor as any).first_name,
            last_name: (item.contractor as any).last_name,
            avatar_url: (item.contractor as any).avatar_url
          } : {
            id: item.contractor_id,
            first_name: '',
            last_name: ''
          },
          created_at: item.created_at,
          updated_at: item.updated_at,
          service_type: item.service_type,
          status: item.status,
          event_time: item.event_time,
          image_url: item.image_url,
          zipcode: item.zipcode,
          venue_id: item.venue_id
        }));
        
        setEvents(formattedEvents);
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
