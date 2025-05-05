
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '../types';

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
              image_url,
              status
            `)
            .eq('contractor_id', userId)
            .order('event_date', { ascending: false });
            
          if (error) {
            throw error;
          }
          
          // Type casting the event data
          const typedEvents = eventData?.map(event => {
            let status: 'open' | 'closed' | 'published' | 'draft' = 'published';
            
            // Map the database status to our allowed types
            if (['open', 'closed', 'published', 'draft'].includes(event.status)) {
              status = event.status as 'open' | 'closed' | 'published' | 'draft';
            }
            
            return {
              id: event.id,
              name: event.name,
              description: event.description || '',
              event_date: event.event_date,
              location: event.location,
              image_url: event.image_url || '',
              status: status
            } as Event;
          }) || [];
          
          setEvents(typedEvents);
        } else {
          // Fetch events where the provider's application was accepted
          const { data: applications, error } = await supabase
            .from('event_applications')
            .select(`
              event_id,
              event:events(
                id,
                name,
                description,
                event_date,
                location,
                image_url,
                status
              )
            `)
            .eq('provider_id', userId)
            .eq('status', 'accepted');
            
          if (error) {
            throw error;
          }
          
          // Extract events from applications and type them correctly
          const typedEvents = applications?.map(app => {
            const eventData = app.event;
            if (!eventData) return null;
            
            let status: 'open' | 'closed' | 'published' | 'draft' = 'published';
            
            // Map the database status to our allowed types
            if (eventData.status && 
                ['open', 'closed', 'published', 'draft'].includes(eventData.status)) {
              status = eventData.status as 'open' | 'closed' | 'published' | 'draft';
            }
            
            return {
              id: eventData.id,
              name: eventData.name,
              description: eventData.description || '',
              event_date: eventData.event_date,
              location: eventData.location,
              image_url: eventData.image_url || '',
              status: status
            } as Event;
          }).filter(Boolean) as Event[];
          
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
