
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Event, EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';

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
  });

  useEffect(() => {
    const fetchData = async () => {
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
        
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select(`
            *,
            creator:user_profiles(first_name, last_name, phone_number)
          `)
          .eq('id', id)
          .single();
          
        if (eventError) throw eventError;
        
        const safeGetCreator = () => {
          if (eventData?.creator && 
              typeof eventData?.creator === 'object' && 
              !('code' in (eventData?.creator || {})) &&
              !('message' in (eventData?.creator || {})) &&
              !('details' in (eventData?.creator || {})) &&
              !('hint' in (eventData?.creator || {}))) {
            return {
              first_name: (eventData.creator as any)?.first_name ?? '',
              last_name: (eventData.creator as any)?.last_name ?? '',
              phone_number: (eventData.creator as any)?.phone_number ?? null
            };
          }
          return null;
        };
        
        const creatorData = safeGetCreator();
        
        const processedEvent: Event = {
          id: eventData.id,
          name: eventData.name,
          description: eventData.description,
          event_date: eventData.event_date,
          location: eventData.location,
          max_attendees: eventData.max_attendees,
          contractor_id: eventData.contractor_id,
          created_at: eventData.created_at,
          updated_at: eventData.updated_at || null,
          service_type: eventData.service_type,
          status: eventData.status,
          creator: creatorData
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
            const safeGetProvider = () => {
              if (app?.provider && 
                  typeof app?.provider === 'object' && 
                  !('code' in (app?.provider || {})) &&
                  !('message' in (app?.provider || {})) &&
                  !('details' in (app?.provider || {})) &&
                  !('hint' in (app?.provider || {}))) {
                return {
                  first_name: (app.provider as any)?.first_name ?? '',
                  last_name: (app.provider as any)?.last_name ?? ''
                };
              }
              return null;
            };
            
            return {
              id: app.id,
              event_id: app.event_id,
              provider_id: app.provider_id,
              message: app.message,
              status: app.status,
              created_at: app.created_at,
              provider: safeGetProvider()
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
          
          setState(prev => ({
            ...prev,
            event: processedEvent,
            userRole: userProfile.role,
            loading: false,
            userHasApplied: !!applicationData,
            userApplication: applicationData ? {
              id: applicationData.id,
              event_id: applicationData.event_id,
              provider_id: applicationData.provider_id,
              message: applicationData.message,
              status: applicationData.status,
              created_at: applicationData.created_at,
              provider: null
            } : null
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
    };

    fetchData();
  }, [id, user, navigate, toast]);

  return state;
};
