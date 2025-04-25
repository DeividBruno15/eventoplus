
import { EventsHeader } from "./EventsHeader";
import { EventsSearch } from "./EventsSearch";
import { EventsList } from "@/components/events/EventsList";

interface EventsContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const EventsContent = ({ searchQuery, setSearchQuery }: EventsContentProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <EventsHeader />
      <EventsSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <EventsList searchQuery={searchQuery} />
    </div>
  );
};
