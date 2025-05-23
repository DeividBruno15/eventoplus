
import { useUserEvents } from '../hooks/useUserEvents';
import { EventsLoading } from './events/EventsLoading';
import { EventsEmpty } from './events/EventsEmpty';
import { EventsList } from './events/EventsList';
import { Event as UserProfileEvent } from '../types';

interface UserEventsProps {
  userId: string;
  userRole?: 'contractor' | 'provider';
}

export const UserEvents = ({ userId, userRole = 'contractor' }: UserEventsProps) => {
  const { events, loading } = useUserEvents(userId, userRole);

  if (loading) {
    return <EventsLoading />;
  }

  if (events.length === 0) {
    return <EventsEmpty userRole={userRole} />;
  }

  return <EventsList events={events as UserProfileEvent[]} userRole={userRole} />;
};
