
import { useState } from "react";
import { EventsHeader } from "./EventsHeader";
import { EventsSearch } from "./EventsSearch";
import { EventsList } from "@/components/events/EventsList";

export const EventsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <EventsHeader />
      <EventsSearch 
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <EventsList searchQuery={searchQuery} />
    </div>
  );
};
