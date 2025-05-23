
import { useState, useEffect, useRef, useCallback } from "react";
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
  
  // Use refs to track refresh state and mount status
  const processedRefresh = useRef(false);
  const isInitialMount = useRef(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Process URL refresh parameter
  const handleRefreshParam = useCallback(async () => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('refresh') === 'true' && !processedRefresh.current) {
      console.log("Refresh param detected, fetching events");
      processedRefresh.current = true; // Mark as processed to prevent loops
      
      try {
        // Fetch events
        await fetchEvents();
        console.log("Events refreshed successfully after deletion");
        
        // Clear the refresh parameter immediately to prevent infinite loops
        const newParams = new URLSearchParams(location.search);
        newParams.delete('refresh');
        const newSearch = newParams.toString() ? `?${newParams.toString()}` : '';
        
        // Use replace to avoid adding to navigation history
        navigate(location.pathname + newSearch, { replace: true });
      } catch (error) {
        console.error("Error refreshing events:", error);
        processedRefresh.current = false; // Reset if there was an error
      }
    } else if (!urlParams.get('refresh')) {
      // Reset the processed flag when the parameter is not present
      processedRefresh.current = false;
    }
  }, [location.search, fetchEvents, navigate, location.pathname]);
  
  // Handle initial mount and refresh parameter
  useEffect(() => {
    if (isInitialMount.current) {
      console.log("Initial mount, fetching events");
      isInitialMount.current = false;
      // Always fetch events on first mount
      fetchEvents().finally(() => {
        // Mark initial load as complete regardless of success or failure
        setInitialLoadComplete(true);
      });
      return;
    }
    
    handleRefreshParam();
  }, [location.search, fetchEvents, handleRefreshParam]);

  // Filter events only when events or search query changes
  useEffect(() => {
    console.log("Filtering events based on search:", events.length);
    
    const filtered = events.filter(event => 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    console.log("Filtered events count:", filtered.length);
    setFilteredEvents(filtered);
  }, [events, searchQuery]);

  // Mostrar o loading apenas durante o carregamento inicial
  if (loading && !initialLoadComplete) {
    return <EventsLoading />;
  }

  // Depois que o carregamento inicial estiver concluído, mostrar o estado vazio se não houver eventos
  if (filteredEvents.length === 0) {
    return <EmptyEventsList />;
  }

  return <EventsGrid events={filteredEvents} />;
};
