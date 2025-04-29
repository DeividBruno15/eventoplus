
import { useState, useEffect } from "react";
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
  const { fetchEvents, loading, setLoading } = useFetchContractorEvents(user?.id);

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
    const getEvents = async () => {
      const eventData = await fetchEvents();
      setEvents(eventData);
    };
    
    getEvents();
  }, [user]);

  return { events, loading, fetchEvents };
};
