
import { useState, useEffect, useCallback } from "react";
import { Event } from "@/types/events";
import { useAuth } from "@/hooks/useAuth";
import { useFetchContractorEvents } from "./useFetchContractorEvents";
import { useEventRealtimeSubscription } from "./useEventRealtimeSubscription";

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
      return [newEvent, ...prevEvents];
    });
  }, []);

  const handleEventUpdated = useCallback((updatedEvent: Event) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  }, []);

  const handleEventDeleted = useCallback((deletedEventId: string) => {
    console.log("Event deletion detected, removing event ID:", deletedEventId);
    setEvents(prevEvents => {
      // Important: Create a new array to ensure React detects the state change
      const filteredEvents = prevEvents.filter(event => event.id !== deletedEventId);
      console.log(`Filtered events: ${prevEvents.length} -> ${filteredEvents.length}`);
      return filteredEvents;
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
      fetchEvents();
    }
  }, [user?.id, fetchEvents]);

  return { events, loading, fetchEvents };
};
