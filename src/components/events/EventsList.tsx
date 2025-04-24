
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Event, EventStatus } from "@/types/events";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./EventCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export const EventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Process the events to match our Event type
        const processedEvents: Event[] = (data || []).map(event => ({
          id: event.id,
          name: event.name,
          description: event.description,
          event_date: event.event_date,
          location: event.location,
          max_attendees: event.max_attendees,
          contractor_id: event.contractor_id,
          created_at: event.created_at,
          updated_at: event.updated_at || null,
          service_type: event.service_type,
          status: event.status as EventStatus
        }));
        
        setEvents(processedEvents);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="text-center py-16">
        <h3 className="text-xl font-medium mb-2">Nenhum evento encontrado</h3>
        <p className="text-muted-foreground mb-6">
          Crie seu primeiro evento e comece a organizar!
        </p>
        <Button onClick={() => navigate('/events/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Evento
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
