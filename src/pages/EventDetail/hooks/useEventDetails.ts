
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventApplication, ServiceRequest } from '@/types/events';
import { Json } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

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
          const { data: userAppData, error: userAppError } = await supabase
            .from('event_applications')
            .select('*')
            .eq('event_id', id)
            .eq('provider_id', user.id)
            .limit(1);
            
          if (userAppError) {
            console.error('Error fetching user application:', userAppError);
          }
            
          if (userAppData && userAppData.length > 0) {
            setUserHasApplied(true);
            setUserApplication(userAppData[0] as EventApplication);
            console.log("User has applied to this event:", userAppData[0]);
          }
          
          // For contractors, fetch all applications for this event
          if ((userRole === 'contractor' || user.user_metadata?.role === 'contractor') && eventData?.contractor_id === user.id) {
            console.log("Fetching applications for contractor:", user.id);
            const { data: appsData, error: appsError } = await supabase
              .from('event_applications')
              .select(`
                *,
                provider:user_profiles!provider_id (
                  id,
                  first_name, 
                  last_name,
                  email,
                  avatar_url
                )
              `)
              .eq('event_id', id)
              .order('created_at', { ascending: false });
              
            if (appsError) {
              console.error('Error fetching applications:', appsError);
              toast.error("Erro ao carregar candidaturas");
            }
            
            if (appsData) {
              const typedApplications = appsData.map(app => ({
                ...app,
                provider: app.provider || { 
                  id: '',
                  first_name: '', 
                  last_name: '',
                  email: '',
                  avatar_url: null
                }
              })) as EventApplication[];
              
              setApplications(typedApplications);
              console.log("Applications fetched:", typedApplications);
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
  }, [id, user, userRole]);

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
