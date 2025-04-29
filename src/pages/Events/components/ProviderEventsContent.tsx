
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProviderEventsList } from "./ProviderEventsList";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { NoServicesWarning } from "./NoServicesWarning";
import { EventsSearch } from "./EventsSearch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Event, EventStatus } from "@/types/events";
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

        console.log("Provider services fetched:", data);
        setUserServices(data.map(service => service.category));
      } catch (error) {
        console.error('Error fetching provider services:', error);
        toast.error('Erro ao carregar seus serviços');
      }
    };

    fetchUserServices();
  }, [user]);

  // Fetch events and set up real-time subscription
  useEffect(() => {
    if (!user || userServices.length === 0) {
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        console.log("Fetching events for service categories:", userServices);
        
        // Fetch events that match user services and are published
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .in('service_type', userServices)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log("Fetched events:", events);

        // Fetch ALL applications by this provider
        const { data: applications, error: appError } = await supabase
          .from('event_applications')
          .select('event_id, status')
          .eq('provider_id', user.id);

        if (appError) throw appError;

        console.log('Fetched applications:', applications?.length || 0, 'applications');
        
        const appliedEventIds = applications ? applications.map(app => app.event_id) : [];
        
        console.log('Applied event IDs:', appliedEventIds);

        // Separate applied and available events
        if (events) {
          // Need to cast the JSON data to match our Event type
          const typedEvents = events.map((event: any) => ({
            ...event,
            status: event.status as EventStatus,
            service_requests: event.service_requests as unknown as Event['service_requests'],
            contractor: {
              id: event.contractor_id,
              first_name: '',
              last_name: '',
            }
          }));
          
          // Only show events in the available list that the user has NOT applied to
          const availableEventsFiltered = typedEvents.filter((event) => 
            !appliedEventIds.includes(event.id)
          );
          
          console.log('Available events after filtering:', availableEventsFiltered.length);
          setAvailableEvents(availableEventsFiltered);
          
          // For applied events, fetch them by IDs
          if (appliedEventIds.length > 0) {
            const { data: appliedEventsData, error: appliedError } = await supabase
              .from('events')
              .select('*')
              .in('id', appliedEventIds)
              .order('created_at', { ascending: false });
              
            if (appliedError) throw appliedError;
            
            // Cast the applied events data too
            const typedAppliedEvents = appliedEventsData ? appliedEventsData.map((event: any) => ({
              ...event,
              status: event.status as EventStatus,
              service_requests: event.service_requests as unknown as Event['service_requests'],
              contractor: {
                id: event.contractor_id,
                first_name: '',
                last_name: '',
              }
            })) : [];
            
            console.log('Applied events fetched:', typedAppliedEvents.length);
            setAppliedEvents(typedAppliedEvents);
          } else {
            console.log('No applied events found');
            setAppliedEvents([]);
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
    
    // Set up real-time subscription for events deletions
    if (userServices.length > 0) {
      console.log("Setting up real-time subscription for provider events");
      const channel = supabase
        .channel('provider-events-changes')
        .on('postgres_changes', 
          { 
            event: 'DELETE',
            schema: 'public', 
            table: 'events'
          }, 
          (payload) => {
            console.log('Event deleted, updating lists:', payload.old);
            const deletedEventId = payload.old.id;
            
            // Remove from available events if present
            setAvailableEvents(current => 
              current.filter(event => event.id !== deletedEventId)
            );
            
            // Remove from applied events if present
            setAppliedEvents(current => 
              current.filter(event => event.id !== deletedEventId)
            );
          }
        )
        .subscribe((status) => {
          console.log('Provider events subscription status:', status);
        });
        
      return () => {
        console.log('Removing provider events subscription');
        supabase.removeChannel(channel);
      };
    }
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
        <EventsSearch 
          value={searchQuery} 
          onChange={setSearchQuery} 
        />
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
