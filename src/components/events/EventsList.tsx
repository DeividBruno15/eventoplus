
import { useState, useEffect } from "react";
import { Event } from "@/types/events";
import { EmptyEventsList } from "./EmptyEventsList";
import { EventsLoading } from "./EventsLoading";
import { EventsGrid } from "./EventsGrid";
import { useContractorEvents } from "@/hooks/events/useContractorEvents";
import { useLocation } from "react-router-dom";

interface EventsListProps {
  searchQuery?: string;
}

export const EventsList = ({ searchQuery = '' }: EventsListProps) => {
  const location = useLocation();
  const { events, loading, fetchEvents } = useContractorEvents();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // Refetch events when query parameters change (like after deletion)
  useEffect(() => {
    fetchEvents();
  }, [location.search, fetchEvents]);

  useEffect(() => {
    console.log("EventsList - eventos disponíveis:", events.length);
    
    const filtered = events.filter(event => 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    console.log("EventsList - eventos filtrados:", filtered.length);
    setFilteredEvents(filtered);
  }, [events, searchQuery]);

  if (loading) {
    return <EventsLoading />;
  }

  if (filteredEvents.length === 0) {
    return <EmptyEventsList />;
  }

  return <EventsGrid events={filteredEvents} />;
};
