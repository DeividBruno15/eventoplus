
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/events';

export const useUserEvents = (userId: string, userRole: 'contractor' | 'provider') => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        if (userRole === 'contractor') {
          // Fetch events created by the contractor
          const { data: eventData, error } = await supabase
            .from('events')
            .select(`
              id,
              name,
              description,
              event_date,
              location,
              image_url
            `)
            .eq('contractor_id', userId)
            .order('event_date', { ascending: false });
            
          if (error) {
            throw error;
          }
          
          // Type casting the event data
          const typedEvents = eventData?.map(event => {
            return {
              id: event.id,
              name: event.name,
              description: event.description,
              event_date: event.event_date,
              location: event.location,
              image_url: event.image_url || '',
              contractor_id: userId,
              user_id: userId, // assuming user_id is the same as contractor_id for events
              created_at: '', // default values for required fields
              service_type: '', // default values for required fields
              status: 'published' as const, // default values for required fields
              service_requests: [] // default values for required fields
            } as Event;
          }) || [];
          
          setEvents(typedEvents);
        } else {
          // Fetch events where the provider's application was accepted
          const { data: applications, error } = await supabase
            .from('event_applications')
            .select(`
              event:event_id (
                id,
                name,
                description,
                event_date,
                location,
                image_url
              )
            `)
            .eq('provider_id', userId)
            .eq('status', 'accepted');
            
          if (error) {
            throw error;
          }
          
          // Extract events from applications and type them correctly
          const typedEvents = applications?.map(app => {
            const event = app.event;
            return {
              id: event.id,
              name: event.name,
              description: event.description,
              event_date: event.event_date,
              location: event.location,
              image_url: event.image_url || '',
              contractor_id: '', // We don't have this data here
              user_id: '', // We don't have this data here
              created_at: '', // default values for required fields
              service_type: '', // default values for required fields
              status: 'published' as const, // default values for required fields
              service_requests: [] // default values for required fields
            } as Event;
          }) || [];
          
          setEvents(typedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [userId, userRole]);
  
  return { events, loading };
};
