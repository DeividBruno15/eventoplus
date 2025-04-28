
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionContext";
import { useToast } from "@/hooks/use-toast";
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
  const { session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [appliedEvents, setAppliedEvents] = useState<Event[]>([]);
  const [providerServices, setProviderServices] = useState<string[]>([]);

  const parseServiceRequests = (jsonData: Json | null): ServiceRequest[] => {
    if (!jsonData) return [];
    
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => ({
        category: typeof item === 'object' && item !== null ? String(item.category || '') : '',
        count: typeof item === 'object' && item !== null ? Number(item.count || 0) : 0,
        filled: typeof item === 'object' && item !== null ? Number(item.filled || 0) : 0
      }));
    }
    return [];
  };

  useEffect(() => {
    const fetchProviderServices = async () => {
      if (!session?.user) return;

      try {
        const { data, error } = await supabase
          .from('provider_services')
          .select('category')
          .eq('provider_id', session.user.id);

        if (error) throw error;
        
        if (data) {
          setProviderServices(data.map(item => item.category));
        }
      } catch (error) {
        console.error('Error fetching provider services:', error);
      }
    };

    fetchProviderServices();
  }, [session]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!providerServices.length) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .in('service_type', providerServices)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const { data: applications, error: appError } = await supabase
          .from('event_applications')
          .select('event_id')
          .eq('provider_id', session?.user?.id);

        if (appError) throw appError;

        const appliedEventIds = applications?.map(app => app.event_id) || [];
        
        const available: Event[] = [];
        const applied: Event[] = [];
        
        events?.forEach(event => {
          const eventData: Event = {
            ...event,
            service_requests: parseServiceRequests(event.service_requests as Json)
          } as Event;
          
          if (appliedEventIds.includes(event.id)) {
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

    if (session?.user) {
      fetchEvents();
    }
  }, [providerServices, session?.user, toast]);

  const handleApply = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleViewDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

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
