import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event, EventStatus } from "@/types/events";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./EventCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface EventsListProps {
  searchQuery?: string;
}

export const EventsList = ({ searchQuery = '' }: EventsListProps) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('contractor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const processedEvents: Event[] = (data || []).map(event => {
        const eventData = event as any;
        return {
          id: eventData.id,
          name: eventData.name, 
          description: eventData.description,
          event_date: eventData.event_date,
          location: eventData.location,
          max_attendees: eventData.max_attendees,
          contractor_id: eventData.contractor_id,
          created_at: eventData.created_at,
          updated_at: eventData.updated_at || null,
          service_type: eventData.service_type,
          status: eventData.status as EventStatus,
          event_time: eventData.event_time,
          image_url: eventData.image_url ? String(eventData.image_url) : undefined
        };
      });
      
      setEvents(processedEvents);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os eventos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    
    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'events' 
        }, 
        payload => {
          if (payload.eventType === 'INSERT') {
            setEvents(prevEvents => [payload.new as Event, ...prevEvents]);
          } else if (payload.eventType === 'UPDATE') {
            setEvents(prevEvents => 
              prevEvents.map(event => 
                event.id === payload.new.id ? payload.new as Event : event
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setEvents(prevEvents => 
              prevEvents.filter(event => event.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredEvents.length === 0) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
