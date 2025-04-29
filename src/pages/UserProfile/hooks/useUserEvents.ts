
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
          await fetchContractorEvents(userId);
        } else {
          await fetchProviderEvents(userId);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId, userRole]);

  const fetchContractorEvents = async (contractorId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('id, name, description, event_date, location, image_url')
      .eq('contractor_id', contractorId)
      .order('event_date', { ascending: false })
      .limit(5);
        
    if (error) throw error;
    setEvents(data || []);
  };

  const fetchProviderEvents = async (providerId: string) => {
    const { data, error } = await supabase
      .from('event_applications')
      .select(`
        id,
        events:event_id (
          id, name, description, event_date, location, image_url
        )
      `)
      .eq('provider_id', providerId)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false })
      .limit(5);
        
    if (error) throw error;
    
    // Extract the events from the nested structure
    const providerEvents = (data || [])
      .map(item => item.events)
      .filter(event => event); // Filter out any nulls
        
    setEvents(providerEvents);
  };

  return { events, loading };
};
