
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/events';
import { Json } from '@/integrations/supabase/types';
import { useServiceRequestUtils } from './useServiceRequestUtils';

/**
 * Hook for fetching event data
 */
export const useFetchEvent = () => {
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const { parseServiceRequests } = useServiceRequestUtils();

  /**
   * Fetches an event by ID
   * @param id The event ID to fetch
   * @returns The event data or null if not found
   */
  const fetchEvent = async (id: string): Promise<Event | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const eventData: Event = {
        ...data,
        service_requests: data.service_requests ? parseServiceRequests(data.service_requests as Json) : null
      } as Event;

      setEvent(eventData);
      return eventData;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    fetchEvent, 
    loading, 
    event 
  };
};
