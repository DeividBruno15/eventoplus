
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Event, ServiceRequest } from "@/types/events";
import { NoServicesWarning } from "./NoServicesWarning";
import { ProviderEventsList } from "./ProviderEventsList";
import { Json } from "@/integrations/supabase/types";

interface ProviderEventsContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ProviderEventsContent: React.FC<ProviderEventsContentProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [appliedEvents, setAppliedEvents] = useState<Event[]>([]);
  const [providerServices, setProviderServices] = useState<string[]>([]);

  const parseServiceRequests = (jsonData: Json | null): ServiceRequest[] => {
    if (!jsonData) return [];
    
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => {
        if (typeof item === 'object' && item !== null) {
          const jsonObj = item as Record<string, Json>;
          return {
            category: typeof jsonObj.category === 'string' ? jsonObj.category : '',
            count: typeof jsonObj.count === 'number' ? jsonObj.count : 0,
            filled: typeof jsonObj.filled === 'number' ? jsonObj.filled : 0
          };
        }
        return { category: '', count: 0, filled: 0 };
      });
    }
    return [];
  };

  function handleApply(eventId: string) {
    navigate(`/events/${eventId}`);
  }

  function handleViewDetails(eventId: string) {
    navigate(`/events/${eventId}`);
  }

  useEffect(() => {
    const fetchProviderServices = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('provider_services')
          .select('category')
          .eq('provider_id', user.id);

        if (error) throw error;
        
        if (data) {
          setProviderServices(data.map(item => item.category));
        }
      } catch (error) {
        console.error('Error fetching provider services:', error);
      }
    };

    fetchProviderServices();
  }, [user]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!providerServices.length || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch all events that match the provider's service categories
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .in('service_type', providerServices)
          .not('status', 'eq', 'closed')  // Don't show closed events
          .not('status', 'eq', 'cancelled')  // Don't show cancelled events
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch provider's applications to determine which events they've applied to
        const { data: applications, error: appError } = await supabase
          .from('event_applications')
          .select('event_id, status')
          .eq('provider_id', user.id);

        if (appError) throw appError;

        // Create a map of event IDs to application status
        const applicationMap = (applications || []).reduce((acc, app) => {
          acc[app.event_id] = app.status;
          return acc;
        }, {} as Record<string, string>);
        
        const available: Event[] = [];
        const applied: Event[] = [];
        
        (events || []).forEach(event => {
          const eventData: Event = {
            ...event,
            service_requests: parseServiceRequests(event.service_requests as Json)
          } as Event;
          
          // If the user has applied to this event, add it to applied events
          if (applicationMap[event.id]) {
            // If the application is accepted, mark the event as published
            if (applicationMap[event.id] === 'accepted') {
              eventData.status = 'published';
            }
            applied.push(eventData);
          } else {
            available.push(eventData);
          }
        });

        setAvailableEvents(available);
        setAppliedEvents(applied);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os eventos disponíveis.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [providerServices, user]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
        <p className="text-muted-foreground mt-2">
          Visualize e candidate-se para eventos que correspondem aos seus serviços.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar eventos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {providerServices.length === 0 ? (
        <NoServicesWarning />
      ) : (
        <ProviderEventsList
          loading={loading}
          availableEvents={availableEvents}
          appliedEvents={appliedEvents}
          searchQuery={searchQuery}
          onApply={handleApply}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};
