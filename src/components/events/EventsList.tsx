
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/types/events";
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
        
        // Map database fields to our Event interface
        const formattedEvents = data?.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          event_date: item.event_date,
          event_time: item.event_time,
          location: item.location,
          latitude: item.latitude,
          longitude: item.longitude,
          images: item.images || [],
          event_type: item.event_type,
          target_audience: item.target_audience,
          status: item.status,
          creator_id: item.creator_id,
          estimated_budget: item.estimated_budget,
          max_guests: item.max_guests,
          created_at: item.created_at,
          updated_at: item.updated_at
        })) as Event[];
        
        setEvents(formattedEvents || []);
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
