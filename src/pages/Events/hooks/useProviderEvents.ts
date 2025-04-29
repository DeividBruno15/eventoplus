
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventStatus } from "@/types/events";
import { toast } from "sonner";

export const useProviderEvents = (userServices: string[]) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [appliedEvents, setAppliedEvents] = useState<Event[]>([]);

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

  return { loading, availableEvents, setAvailableEvents, appliedEvents, setAppliedEvents };
};
