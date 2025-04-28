
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Event, EventApplication, ApplicationStatus, EventStatus, ServiceRequest } from '@/types/events';
import { User } from '@supabase/supabase-js';
import { Json } from '@/integrations/supabase/types';

interface UseEventDetailsProps {
  id: string | undefined;
  user: User | null;
}

interface EventDetailsState {
  event: Event | null;
  applications: EventApplication[];
  userRole: string | null;
  loading: boolean;
  userHasApplied: boolean;
  userApplication: EventApplication | null;
  refetchEvent: () => void;
}

export const useEventDetails = ({ id, user }: UseEventDetailsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<EventDetailsState>({
    event: null,
    applications: [],
    userRole: null,
    loading: true,
    userHasApplied: false,
    userApplication: null,
    refetchEvent: () => {}, // Will be overridden later
  });

  // Helper function to parse service_requests from Json to ServiceRequest[]
  const parseServiceRequests = (jsonData: Json): ServiceRequest[] | null => {
    if (!jsonData) return null;
    
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => {
        if (typeof item === 'object' && item !== null) {
          const jsonObj = item as Record<string, Json>;
          return {
            category: typeof jsonObj.category === 'string' ? jsonObj.category : '',
            count: typeof jsonObj.count === 'number' ? jsonObj.count : 0,
            filled: typeof jsonObj.filled === 'number' ? jsonObj.filled : 0
          };
        }
        return { category: '', count: 0, filled: 0 };
      });
    }
    return [];
  };

  const fetchEventData = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (userError) throw userError;
      
      // Removendo a relação creator:user_profiles que está causando o erro
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
        
      if (eventError) throw eventError;
      
      // Type assertion for eventData to handle all fields properly
      const typedEventData = eventData as any;
      
      // Create an Event object with all required fields
      const processedEvent: Event = {
        id: typedEventData.id,
        name: typedEventData.name,
        description: typedEventData.description,
        event_date: typedEventData.event_date,
        location: typedEventData.location,
        max_attendees: typedEventData.max_attendees,
        contractor_id: typedEventData.contractor_id,
        created_at: typedEventData.created_at,
        updated_at: typedEventData.updated_at || null,
        service_type: typedEventData.service_type,
        status: typedEventData.status as EventStatus,
        image_url: typedEventData.image_url ? String(typedEventData.image_url) : null,
        event_time: typedEventData.event_time,
        service_requests: parseServiceRequests(typedEventData.service_requests as Json),
        zipcode: typedEventData.zipcode || null
      };

      if (eventData.contractor_id === user?.id) {
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('event_applications')
          .select(`
            *,
            provider:user_profiles(first_name, last_name)
          `)
          .eq('event_id', id)
          .order('created_at', { ascending: false });
          
        if (applicationsError) throw applicationsError;
        
        const processedApplications: EventApplication[] = (applicationsData || []).map(app => {
          const appData = app as any; // Type assertion to avoid TypeScript errors
          return {
            id: appData.id,
            event_id: appData.event_id,
            provider_id: appData.provider_id,
            message: appData.message || "",
            status: appData.status as ApplicationStatus,
            created_at: appData.created_at,
            updated_at: null, // Set default value since it might not exist in the fetched data
            price: appData.price !== undefined ? appData.price : null,
            provider: appData.provider ? {
              first_name: (appData.provider as any)?.first_name ?? '',
              last_name: (appData.provider as any)?.last_name ?? '',
              email: ''  // Adding a default value for the required email field
            } : undefined
          };
        });
        
        setState(prev => ({
          ...prev,
          event: processedEvent,
          applications: processedApplications,
          userRole: userProfile.role,
          loading: false
        }));
      } else {
        const { data: applicationData, error: applicationError } = await supabase
          .from('event_applications')
          .select('*')
          .eq('event_id', id)
          .eq('provider_id', user?.id)
          .maybeSingle();
          
        if (applicationError) throw applicationError;
        
        // Type assertion for applicationData to handle the price property
        const typedApplicationData = applicationData as any;
        
        setState(prev => ({
          ...prev,
          event: processedEvent,
          userRole: userProfile.role,
          loading: false,
          userHasApplied: !!applicationData,
          userApplication: typedApplicationData ? {
            id: typedApplicationData.id,
            event_id: typedApplicationData.event_id,
            provider_id: typedApplicationData.provider_id,
            message: typedApplicationData.message || "",
            status: typedApplicationData.status as ApplicationStatus,
            created_at: typedApplicationData.created_at,
            updated_at: null, // Set default value since it might not exist in the fetched data
            price: typedApplicationData.price !== undefined ? typedApplicationData.price : null
          } : null,
          applications: []
        }));
      }
    } catch (error: any) {
      console.error('Erro ao buscar detalhes do evento:', error);
      toast({
        title: "Erro ao carregar evento",
        description: "Não foi possível carregar os detalhes do evento",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [id, user, navigate, toast]);

  const refetchEvent = useCallback(() => {
    setState(prev => ({ ...prev, loading: true }));
    fetchEventData();
  }, [fetchEventData]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  return { ...state, refetchEvent };
};
