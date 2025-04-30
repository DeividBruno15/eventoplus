
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
      
    // Configurando o canal para receber atualizações em tempo real
    const channel = supabase
      .channel('events-realtime-channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'events',
          filter: `contractor_id=eq.${userId}` 
        }, 
        payload => {
          console.log('Event insert received:', payload);
          if (payload.new) {
            const processedEvent = transformEventData(payload.new);
            onEventAdded(processedEvent);
          }
        }
      )
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'events',
          filter: `contractor_id=eq.${userId}` 
        }, 
        payload => {
          console.log('Event update received:', payload);
          if (payload.new) {
            const processedEvent = transformEventData(payload.new);
            onEventUpdated(processedEvent);
          }
        }
      )
      .on('postgres_changes', 
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'events',
          filter: `contractor_id=eq.${userId}` 
        }, 
        payload => {
          console.log('Event deletion received:', payload);
          // Make sure we're getting the deleted event ID
          if (payload.old && payload.old.id) {
            const deletedEventId = payload.old.id;
            console.log('Removing event with ID:', deletedEventId);
            // Garantindo que onEventDeleted é chamado com o ID correto
            onEventDeleted(deletedEventId);
          } else {
            console.error('Missing ID in delete event payload:', payload);
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
