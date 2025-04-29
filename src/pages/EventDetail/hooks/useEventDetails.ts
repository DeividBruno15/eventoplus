
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventApplication, ServiceRequest } from '@/types/events';
import { Json } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@supabase/supabase-js';

interface EventDetailsProps {
  id?: string;
  user?: User | null;
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

export const useEventDetails = ({ id, user: passedUser }: EventDetailsProps): EventDetailsState => {
  const { user: authUser } = useAuth();
  const user = passedUser || authUser;
  const [event, setEvent] = useState<Event | null>(null);
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'provider' | 'contractor' | null>(null);
  const [userHasApplied, setUserHasApplied] = useState(false);
  const [userApplication, setUserApplication] = useState<EventApplication | null>(null);

  const parseServiceRequests = (jsonData: any): ServiceRequest[] => {
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

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching event details for ID:", id);
      
      // Get user role from user_metadata or from the database
      if (user) {
        const userRole = user.user_metadata?.role;
        if (userRole) {
          setUserRole(userRole as 'provider' | 'contractor');
          console.log("User role from metadata:", userRole);
        } else {
          const { data: userProfileData } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (userProfileData) {
            setUserRole(userProfileData.role as 'provider' | 'contractor');
            console.log("User role from database:", userProfileData.role);
          }
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
          // Parse service requests
          const parsedServiceRequests = parseServiceRequests(eventData.service_requests);
          
          const typedEvent: Event = {
            ...eventData,
            service_requests: parsedServiceRequests
          } as Event;
          
          setEvent(typedEvent);
          console.log("Event data fetched:", typedEvent);
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
            console.log("User has applied to this event:", userAppData);
          }
          
          // For contractors, fetch all applications for this event
          if ((userRole === 'contractor' || user.user_metadata?.role === 'contractor') && eventData?.contractor_id === user.id) {
            const { data: appsData } = await supabase
              .from('event_applications')
              .select(`
                *,
                provider:user_profiles!provider_id (
                  first_name, 
                  last_name,
                  email
                )
              `)
              .eq('event_id', id)
              .order('created_at', { ascending: false });
              
            if (appsData) {
              const typedApplications = appsData.map(app => ({
                ...app,
                provider: app.provider || { first_name: '', last_name: '' }
              })) as EventApplication[];
              
              setApplications(typedApplications);
              console.log("Applications fetched:", typedApplications.length);
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
    if (id) {
      fetchData();
    }
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
