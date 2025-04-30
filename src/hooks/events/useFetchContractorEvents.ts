
import { useState } from "react";
import { Event } from "@/types/events";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { transformEventData } from "@/utils/events/eventTransformers";

/**
 * Hook to fetch events for a contractor
 */
export const useFetchContractorEvents = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);

  const fetchEvents = async (): Promise<Event[]> => {
    try {
      setLoading(true);
      
      if (!userId) {
        console.log("No user ID provided to fetch events");
        setLoading(false);
        return [];
      }
      
      console.log("Fetching events for contractor:", userId);
      
      // Get events data from Supabase - ensure we're getting the latest data
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('contractor_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
        throw error;
      }
      
      console.log("Fetched events:", data?.length || 0);
      
      if (data && data.length > 0) {
        // Transform data into valid Event objects
        const processedEvents: Event[] = data.map(transformEventData);
        console.log("Processed events:", processedEvents.length);
        return processedEvents;
      } else {
        console.log("No events found for this contractor");
        return [];
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error("Não foi possível carregar os eventos.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchEvents, loading, setLoading };
};
