
import { useState, useEffect, useCallback } from "react";
import { Event } from "@/types/events";
import { useAuth } from "@/hooks/useAuth";
import { useFetchContractorEvents } from "./useFetchContractorEvents";
import { useEventRealtimeSubscription } from "./useEventRealtimeSubscription";
import { toast } from "sonner";

/**
 * Hook to fetch events belonging to the contractor
 */
export const useContractorEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();
  const { fetchEvents: fetchEventsService, loading, setLoading } = useFetchContractorEvents(user?.id);

  // Define fetchEvents as a callback so it can be passed to other components
  const fetchEvents = useCallback(async () => {
    // Only fetch if we have a user ID
    if (!user?.id) return;
    
    console.log("Fetching events for user:", user?.id);
    setLoading(true);
    try {
      const eventData = await fetchEventsService();
      console.log("Refetched events:", eventData.length);
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Não foi possível carregar os eventos.");
    } finally {
      setLoading(false);
    }
  }, [fetchEventsService, setLoading, user?.id]);

  // Handle event updates from realtime subscription
  const handleEventAdded = useCallback((newEvent: Event) => {
    setEvents(prevEvents => {
      // Check if event already exists to prevent duplicates
      if (prevEvents.some(e => e.id === newEvent.id)) {
        return prevEvents;
      }
      console.log("Adding new event to state:", newEvent.id);
      return [newEvent, ...prevEvents];
    });
  }, []);

  const handleEventUpdated = useCallback((updatedEvent: Event) => {
    setEvents(prevEvents => {
      console.log("Updating event in state:", updatedEvent.id);
      return prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      );
    });
  }, []);

  const handleEventDeleted = useCallback((deletedEventId: string) => {
    console.log("Event deletion detected, removing event ID:", deletedEventId);
    setEvents(prevEvents => {
      // Filter out the deleted event
      const updatedEvents = prevEvents.filter(event => {
        const keepEvent = event.id !== deletedEventId;
        if (!keepEvent) {
          console.log(`Removing event with ID ${deletedEventId} from state`);
        }
        return keepEvent;
      });
      
      // Log para verificar se houve alteração
      console.log(`Filtered events: ${prevEvents.length} -> ${updatedEvents.length}`);
      
      // Se nada foi removido, registra um aviso
      if (updatedEvents.length === prevEvents.length) {
        console.warn("Event not found in state when attempting deletion:", deletedEventId);
      }
      
      return updatedEvents;
    });
  }, []);

  // Set up realtime subscription
  useEventRealtimeSubscription({
    userId: user?.id,
    onEventAdded: handleEventAdded,
    onEventUpdated: handleEventUpdated,
    onEventDeleted: handleEventDeleted
  });

  // Initial data fetch - only run once when the component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      console.log("Initial events fetch for user:", user.id);
      fetchEvents();
    }
  }, [user?.id, fetchEvents]);

  return { events, loading, fetchEvents };
};
