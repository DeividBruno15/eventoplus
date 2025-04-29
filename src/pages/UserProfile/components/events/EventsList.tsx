
import { Event } from '../../types';
import { EventItem } from './EventItem';

interface EventsListProps {
  events: Event[];
  userRole: 'contractor' | 'provider';
}

export const EventsList = ({ events, userRole }: EventsListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">
        {userRole === 'contractor' ? 'Eventos Organizados' : 'Serviços Prestados'}
      </h3>
      
      {events.map(event => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
};
