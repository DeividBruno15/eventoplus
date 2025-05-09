
import { useState, useCallback } from "react";
import { Event } from "@/types/events";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { transformEventData } from "@/utils/events/eventTransformers";

/**
 * Hook to fetch events for a contractor with optimized performance
 */
export const useFetchContractorEvents = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async (): Promise<Event[]> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userId) {
        console.log("No user ID provided to fetch events");
        setLoading(false);
        return [];
      }
      
      console.log("Fetching events for contractor:", userId);
      
      // Get events data from Supabase with pagination for better performance
      // Only fetch the necessary fields to reduce data transfer
      const { data, error } = await supabase
        .from('events')
        .select(`
          id, 
          title, 
          description, 
          location, 
          date, 
          image_url, 
          created_at, 
          contractor_id, 
          status
        `)
        .eq('contractor_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
        setError(new Error(error.message));
        throw error;
      }
      
      console.log("Fetched events:", data?.length || 0);
      
      if (data && data.length > 0) {
        // Transform data into valid Event objects
        const processedEvents: Event[] = data.map(transformEventData);
        console.log("Processed events:", processedEvents.length);
        setEvents(processedEvents);
        return processedEvents;
      } else {
        console.log("No events found for this contractor");
        setEvents([]);
        return [];
      }
    } catch (error: any) {
      console.error('Error fetching events:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
      toast.error("Não foi possível carregar os eventos.");
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { 
    fetchEvents, 
    loading, 
    setLoading, 
    events,
    error 
  };
};
