
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProviderEventsList } from "./ProviderEventsList";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { NoServicesWarning } from "./NoServicesWarning";
import { EventsSearch } from "./EventsSearch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Event } from "@/types/events";
import { toast } from "sonner";

export const ProviderEventsContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userServices, setUserServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [appliedEvents, setAppliedEvents] = useState<Event[]>([]);

  // Fetch user services
  useEffect(() => {
    if (!user) return;

    const fetchUserServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('provider_services')
          .select('category')
          .eq('provider_id', user.id);

        if (error) throw error;

        setUserServices(data.map(service => service.category));
      } catch (error) {
        console.error('Error fetching provider services:', error);
        toast.error('Erro ao carregar seus serviços');
      }
    };

    fetchUserServices();
  }, [user]);

  // Fetch events based on user services
  useEffect(() => {
    if (!user || userServices.length === 0) {
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        // Fetch events that match user services
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .in('service_type', userServices)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch events user has already applied to
        const { data: applications, error: appError } = await supabase
          .from('event_applications')
          .select('event_id')
          .eq('provider_id', user.id);

        if (appError) throw appError;

        const appliedEventIds = applications.map(app => app.event_id);

        // Separate applied and available events
        if (events) {
          setAvailableEvents(events.filter(event => !appliedEventIds.includes(event.id)));
          
          // For applied events, fetch them by IDs
          if (appliedEventIds.length > 0) {
            const { data: appliedEventsData, error: appliedError } = await supabase
              .from('events')
              .select('*')
              .in('id', appliedEventIds)
              .order('created_at', { ascending: false });
              
            if (appliedError) throw appliedError;
            setAppliedEvents(appliedEventsData || []);
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Erro ao carregar eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, userServices]);

  // Send application for an event
  const handleApply = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  // View event details
  const handleViewDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If provider hasn't configured services yet
  if (userServices.length === 0) {
    return <NoServicesWarning />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <EventsSearch value={searchQuery} onChange={setSearchQuery} />
        <Button onClick={() => navigate('/profile')}>
          Gerenciar Serviços
        </Button>
      </div>

      <ProviderEventsList
        loading={loading}
        availableEvents={availableEvents}
        appliedEvents={appliedEvents}
        searchQuery={searchQuery}
        onApply={handleApply}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};
