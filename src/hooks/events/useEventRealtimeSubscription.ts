
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { transformEventData } from "@/utils/events/eventTransformers";

interface UseEventRealtimeSubscriptionProps {
  userId: string | undefined;
  onEventAdded: (event: Event) => void;
  onEventUpdated: (event: Event) => void;
  onEventDeleted: (eventId: string) => void;
}

/**
 * Hook to handle real-time subscriptions for events
 */
export const useEventRealtimeSubscription = ({
  userId,
  onEventAdded,
  onEventUpdated,
  onEventDeleted
}: UseEventRealtimeSubscriptionProps) => {
  useEffect(() => {
    if (!userId) return;
    
    console.log("Setting up realtime subscription for events");
    const channel = supabase
      .channel('events-realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'events',
          filter: `contractor_id=eq.${userId}` 
        }, 
        payload => {
          console.log('Event change received:', payload);
          
          // Handle different event types
          if (payload.eventType === 'INSERT') {
            console.log('New event added:', payload.new);
            const processedEvent = transformEventData(payload.new);
            onEventAdded(processedEvent);
          } else if (payload.eventType === 'UPDATE') {
            console.log('Event updated:', payload.new);
            const processedEvent = transformEventData(payload.new);
            onEventUpdated(processedEvent);
          } else if (payload.eventType === 'DELETE') {
            console.log('Event deleted:', payload.old.id);
            const deletedEventId = payload.old.id;
            console.log('Removing event with ID:', deletedEventId);
            onEventDeleted(deletedEventId);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
      
    // Cleanup subscription on unmount
    return () => {
      console.log('Removing subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, onEventAdded, onEventUpdated, onEventDeleted]);
};
