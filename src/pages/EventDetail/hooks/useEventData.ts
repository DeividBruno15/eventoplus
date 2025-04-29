
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, ServiceRequest, EventStatus } from '@/types/events';
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
      
      // First fetch the event details without trying to join with contractor to ensure we get the data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
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
        
        // Now fetch contractor details separately to avoid join errors
        const { data: contractorData, error: contractorError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name, avatar_url')
          .eq('id', eventData.contractor_id)
          .single();
          
        if (contractorError && contractorError.code !== 'PGRST116') { 
          // PGRST116 means no rows returned, which we can handle as null contractor
          console.error('Error fetching contractor details:', contractorError);
        }
        
        // Handle contractor data safely
        let contractorInfo = { 
          id: eventData.contractor_id, 
          first_name: '', 
          last_name: '', 
          avatar_url: null 
        };
        
        // Use contractor data if available
        if (contractorData) {
          contractorInfo = {
            id: contractorData.id,
            first_name: contractorData.first_name || '',
            last_name: contractorData.last_name || '',
            avatar_url: contractorData.avatar_url
          };
        }
        
        // Create properly typed Event object with status explicitly cast as EventStatus
        const typedEvent: Event = {
          ...eventData,
          service_requests: parsedServiceRequests,
          status: eventData.status as EventStatus,
          contractor: contractorInfo
        };
        
        setEvent(typedEvent);
        console.log("Event data fetched:", typedEvent);
      }
    } catch (error) {
      console.error('Error in fetchEvent:', error);
      toast.error("Erro ao carregar detalhes do evento");
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
