
import { Event } from "@/types/events";
import { EventCard } from "./EventCard";

interface EventsGridProps {
  events: Event[];
}

export const EventsGrid = ({ events }: EventsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
