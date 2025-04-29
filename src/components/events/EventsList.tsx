
import { useState } from "react";
import { Event } from "@/types/events";
import { EmptyEventsList } from "./EmptyEventsList";
import { EventsLoading } from "./EventsLoading";
import { EventsGrid } from "./EventsGrid";
import { useContractorEvents } from "@/hooks/events/useContractorEvents";

interface EventsListProps {
  searchQuery?: string;
}

export const EventsList = ({ searchQuery = '' }: EventsListProps) => {
  const { events, loading } = useContractorEvents();

  if (loading) {
    return <EventsLoading />;
  }

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredEvents.length === 0) {
    return <EmptyEventsList />;
  }

  return <EventsGrid events={filteredEvents} />;
};
