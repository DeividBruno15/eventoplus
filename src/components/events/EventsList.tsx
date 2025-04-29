
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
      
      console.log("Fetching events for contractor:", user.id);
      
      // Modified query to not use join with contractor since it's causing errors
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('contractor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
        throw error;
      }
      
      console.log("Fetched events:", data);
      
      if (data && data.length > 0) {
        // Transform data into valid Event objects
        const processedEvents: Event[] = data.map(event => ({
          id: event.id,
          name: event.name, 
          description: event.description,
          event_date: event.event_date,
          location: event.location,
          max_attendees: event.max_attendees || undefined,
          contractor_id: event.contractor_id,
          // Create a placeholder contractor object that matches the expected type
          contractor: {
            id: event.contractor_id,
            first_name: '', // We'll fetch this separately if needed
            last_name: '',
          },
          created_at: event.created_at,
          updated_at: null, // Ensure this matches the type definition 
          service_type: event.service_type,
          status: event.status as EventStatus,
          event_time: event.event_time || undefined,
          image_url: event.image_url || undefined,
          service_requests: event.service_requests as any || undefined,
          // Add extended properties from database
          zipcode: event.zipcode || undefined,
          street: event.street || undefined,
          number: event.number || undefined,
          neighborhood: event.neighborhood || undefined,
          city: event.city || undefined,
          state: event.state || undefined,
        }));
        
        setEvents(processedEvents);
        console.log("Processed events:", processedEvents);
      } else {
        setEvents([]);
        console.log("No events found for this contractor");
      }
    } catch (error) {
      console.error('Error fetching events:', error);
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
    
    // Set up realtime subscription for events table
    if (user) {
      console.log("Setting up realtime subscription for events");
      const channel = supabase
        .channel('events-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'events',
            filter: `contractor_id=eq.${user.id}` 
          }, 
          payload => {
            console.log('Event change received:', payload);
            
            // Handle different event types
            if (payload.eventType === 'INSERT') {
              console.log('New event added:', payload.new);
              // Convert the new event to the right format
              const newEvent = payload.new as any;
              const processedEvent: Event = {
                id: newEvent.id,
                name: newEvent.name,
                description: newEvent.description,
                event_date: newEvent.event_date,
                location: newEvent.location,
                max_attendees: newEvent.max_attendees || undefined,
                contractor_id: newEvent.contractor_id,
                contractor: {
                  id: newEvent.contractor_id,
                  first_name: '',
                  last_name: '',
                },
                created_at: newEvent.created_at,
                updated_at: null,
                service_type: newEvent.service_type,
                status: newEvent.status as EventStatus,
                event_time: newEvent.event_time || undefined,
                image_url: newEvent.image_url || undefined,
                service_requests: newEvent.service_requests as any || undefined,
                zipcode: newEvent.zipcode || undefined,
                street: newEvent.street || undefined,
                number: newEvent.number || undefined,
                neighborhood: newEvent.neighborhood || undefined,
                city: newEvent.city || undefined,
                state: newEvent.state || undefined,
              };
              
              setEvents(prevEvents => [processedEvent, ...prevEvents]);
            } else if (payload.eventType === 'UPDATE') {
              // Same transformation for updated events
              const updatedEvent = payload.new as any;
              const processedEvent: Event = {
                id: updatedEvent.id,
                name: updatedEvent.name,
                description: updatedEvent.description,
                event_date: updatedEvent.event_date,
                location: updatedEvent.location,
                max_attendees: updatedEvent.max_attendees || undefined,
                contractor_id: updatedEvent.contractor_id,
                contractor: {
                  id: updatedEvent.contractor_id,
                  first_name: '',
                  last_name: '',
                },
                created_at: updatedEvent.created_at,
                updated_at: null,
                service_type: updatedEvent.service_type,
                status: updatedEvent.status as EventStatus,
                event_time: updatedEvent.event_time || undefined,
                image_url: updatedEvent.image_url || undefined,
                service_requests: updatedEvent.service_requests as any || undefined,
                zipcode: updatedEvent.zipcode || undefined,
                street: updatedEvent.street || undefined,
                number: updatedEvent.number || undefined,
                neighborhood: updatedEvent.neighborhood || undefined,
                city: updatedEvent.city || undefined,
                state: updatedEvent.state || undefined,
              };
              
              setEvents(prevEvents => 
                prevEvents.map(event => 
                  event.id === processedEvent.id ? processedEvent : event
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
        
      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, toast]);

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
