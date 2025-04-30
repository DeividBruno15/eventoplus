
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
    setLoading(true);
    const eventData = await fetchEventsService();
    console.log("Refetched events:", eventData.length);
    setEvents(eventData);
    setLoading(false);
  }, [fetchEventsService, setLoading]);

  // Handle event updates from realtime subscription
  const handleEventAdded = (newEvent: Event) => {
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleEventDeleted = (deletedEventId: string) => {
    console.log("Event deletion detected, removing event ID:", deletedEventId);
    setEvents(prevEvents => {
      const filteredEvents = prevEvents.filter(event => event.id !== deletedEventId);
      console.log(`Filtered events: ${prevEvents.length} -> ${filteredEvents.length}`);
      return filteredEvents;
    });
  };

  // Set up realtime subscription
  useEventRealtimeSubscription({
    userId: user?.id,
    onEventAdded: handleEventAdded,
    onEventUpdated: handleEventUpdated,
    onEventDeleted: handleEventDeleted
  });

  // Initial data fetch
  useEffect(() => {
    fetchEvents();
  }, [user, fetchEvents]);

  return { events, loading, fetchEvents };
};
