
import { useState, useEffect, useRef } from "react";
import { Event } from "@/types/events";
import { EmptyEventsList } from "./EmptyEventsList";
import { EventsLoading } from "./EventsLoading";
import { EventsGrid } from "./EventsGrid";
import { useContractorEvents } from "@/hooks/events/useContractorEvents";
import { useLocation, useNavigate } from "react-router-dom";

interface EventsListProps {
  searchQuery?: string;
}

export const EventsList = ({ searchQuery = '' }: EventsListProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { events, loading, fetchEvents } = useContractorEvents();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const processedRefresh = useRef(false);

  // Only refetch events when refresh=true is in the URL and it hasn't been processed yet
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('refresh') === 'true' && !processedRefresh.current) {
      console.log("Refresh param detected, fetching events");
      processedRefresh.current = true; // Mark as processed to prevent loops
      fetchEvents();
      
      // Clear the refresh parameter to prevent infinite loops
      const newParams = new URLSearchParams(location.search);
      newParams.delete('refresh');
      const newSearch = newParams.toString() ? `?${newParams.toString()}` : '';
      
      // Use replace: true to avoid adding to navigation history
      navigate(location.pathname + newSearch, { replace: true });
    } else if (!urlParams.get('refresh')) {
      // Reset the processed flag when the parameter is not present
      processedRefresh.current = false;
    }
  }, [location.search, fetchEvents, navigate, location.pathname]);

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
