
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, ServiceRequest } from '@/types/events';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

/**
 * Parses service request data from JSON to typed objects
 */
export const parseServiceRequests = (jsonData: any): ServiceRequest[] => {
  if (!jsonData) return [];
  
  try {
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => ({
        category: typeof item.category === 'string' ? item.category : '',
        count: typeof item.count === 'number' ? item.count : 0,
        filled: typeof item.filled === 'number' ? item.filled : 0
      }));
    }
    return [];
  } catch (e) {
    console.error("Error parsing service requests:", e);
    return [];
  }
};

/**
 * Fetches event data and contractor information by event ID
 */
export const useEventData = (id?: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchEvent = async () => {
    try {
      if (!id) return;
      
      console.log("Fetching event details for ID:", id);
      
      // Fetch event details with contractor information joined
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          contractor:user_profiles!contractor_id(
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();
        
      if (eventError) {
        console.error('Error fetching event details:', eventError);
        toast.error("Erro ao carregar detalhes do evento");
        throw eventError;
      }
      
      if (eventData) {
        // Parse service requests
        const parsedServiceRequests = parseServiceRequests(eventData.service_requests);
        
        // Handle contractor data safely
        let contractorData = { 
          id: '', 
          first_name: '', 
          last_name: '', 
          avatar_url: null 
        };
        
        // Check if contractor is an error object (from join) or actual data
        if (eventData.contractor && typeof eventData.contractor === 'object' && !('error' in eventData.contractor)) {
          contractorData = eventData.contractor;
        }
        
        // Create properly typed Event object
        const typedEvent: Event = {
          ...eventData,
          service_requests: parsedServiceRequests,
          contractor: {
            id: contractorData.id,
            first_name: contractorData.first_name,
            last_name: contractorData.last_name,
            avatar_url: contractorData.avatar_url
          }
        } as Event;
        
        setEvent(typedEvent);
        console.log("Event data fetched:", typedEvent);
      }
    } catch (error) {
      console.error('Error in fetchEvent:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEvent();
  }, [id]);
  
  return {
    event,
    loading,
    refetchEvent: fetchEvent
  };
};
