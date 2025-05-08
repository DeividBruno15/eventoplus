
import { Event } from '@/types/events';
import { useVenueEvents } from '../hooks/useVenueEvents';
import { EventCard } from '@/components/events/EventCard';
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface VenueEventsProps {
  venueId: string;
}

const VenueEvents = ({ venueId }: VenueEventsProps) => {
  const { events, loading, error } = useVenueEvents(venueId);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Eventos Agendados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Eventos Agendados</h2>
        <div className="p-8 text-center">
          <p className="text-red-500">Erro ao carregar eventos</p>
        </div>
      </div>
    );
  }

  // Filtra apenas eventos futuros ou em andamento
  const upcomingEvents = events.filter(event => new Date(event.event_date) >= new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Eventos Agendados</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/events/create', { state: { preSelectedVenue: venueId } })}
        >
          Criar Evento Aqui
        </Button>
      </div>

      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border rounded-lg bg-muted/20">
          <CalendarX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum evento agendado</h3>
          <p className="text-muted-foreground mb-4">
            Este local ainda não possui eventos agendados.
          </p>
          <Button
            onClick={() => navigate('/events/create', { state: { preSelectedVenue: venueId } })}
          >
            Agendar evento aqui
          </Button>
        </div>
      )}
    </div>
  );
};

export default VenueEvents;
