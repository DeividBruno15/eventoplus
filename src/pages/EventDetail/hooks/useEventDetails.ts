
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventApplication } from '@/types/events';

interface EventDetailsProps {
  id?: string;
  user: any | null;
}

interface EventDetailsState {
  event: Event | null;
  applications: EventApplication[];
  userRole: 'provider' | 'contractor' | null;
  loading: boolean;
  userHasApplied: boolean;
  userApplication: EventApplication | null;
  refetchEvent: () => Promise<void>;
}

export const useEventDetails = ({ id, user }: EventDetailsProps): EventDetailsState => {
  const [event, setEvent] = useState<Event | null>(null);
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'provider' | 'contractor' | null>(null);
  const [userHasApplied, setUserHasApplied] = useState(false);
  const [userApplication, setUserApplication] = useState<EventApplication | null>(null);

  const fetchData = async () => {
    try {
      // Get user role
      if (user) {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (userProfile) {
          setUserRole(userProfile.role as 'provider' | 'contractor');
        }
      }
      
      // Fetch event details
      if (id) {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
          
        if (eventError) {
          throw eventError;
        }
        
        if (eventData) {
          // Parse service requests if they exist
          if (eventData.service_requests) {
            try {
              const parsedServiceRequests = Array.isArray(eventData.service_requests)
                ? eventData.service_requests.map(req => ({
                    category: typeof req === 'object' && req !== null ? String(req.category || '') : '',
                    count: typeof req === 'object' && req !== null ? Number(req.count || 0) : 0,
                    filled: typeof req === 'object' && req !== null ? Number(req.filled || 0) : 0
                  }))
                : [];
                
              eventData.service_requests = parsedServiceRequests;
            } catch (e) {
              console.error("Error parsing service requests:", e);
              eventData.service_requests = [];
            }
          }
          
          setEvent(eventData as Event);
        }
        
        // Fetch applications for this event
        if (user) {
          // Get current user's application if any
          const { data: userAppData } = await supabase
            .from('event_applications')
            .select('*')
            .eq('event_id', id)
            .eq('provider_id', user.id)
            .single();
            
          if (userAppData) {
            setUserHasApplied(true);
            setUserApplication(userAppData as EventApplication);
          }
          
          // For contractors, fetch all applications for this event
          if (userProfile?.role === 'contractor' && eventData?.contractor_id === user.id) {
            const { data: appsData } = await supabase
              .from('event_applications')
              .select(`
                *,
                provider:provider_id (
                  first_name, 
                  last_name,
                  email
                )
              `)
              .eq('event_id', id)
              .order('created_at', { ascending: false });
              
            if (appsData) {
              setApplications(appsData as EventApplication[]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const refetchEvent = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  return {
    event,
    applications,
    userRole,
    loading,
    userHasApplied,
    userApplication,
    refetchEvent
  };
};
