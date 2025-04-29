
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventApplication } from '@/types/events';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

/**
 * Fetches applications for an event when user is the contractor
 */
export const useEventApplicationsList = (eventId?: string, user?: User | null, userRole?: 'provider' | 'contractor' | null) => {
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchApplications = async () => {
      if (!eventId || !user) return;
      
      // Only contractors need to fetch all applications
      if ((userRole !== 'contractor' && user.user_metadata?.role !== 'contractor')) {
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching applications for contractor:", user.id);
        
        // First get applications
        const { data: appsData, error: appsError } = await supabase
          .from('event_applications')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false });
          
        if (appsError) {
          console.error('Error fetching applications:', appsError);
          toast.error("Erro ao carregar candidaturas");
          return;
        }
        
        if (appsData && appsData.length > 0) {
          // Now fetch provider details for each application
          const providerIds = appsData.map(app => app.provider_id);
          const { data: providersData, error: providersError } = await supabase
            .from('user_profiles')
            .select('id, first_name, last_name, avatar_url')
            .in('id', providerIds);
            
          if (providersError) {
            console.error('Error fetching provider profiles:', providersError);
            toast.error("Erro ao carregar detalhes dos prestadores");
          }
          
          // Create a map of providers by id for easy lookup
          const providersMap = (providersData || []).reduce((map, provider) => {
            map[provider.id] = provider;
            return map;
          }, {} as Record<string, any>);
          
          // Map applications with their provider details
          const typedApplications = appsData.map(app => ({
            ...app,
            provider: providersMap[app.provider_id] || { 
              id: app.provider_id,
              first_name: '', 
              last_name: '',
              avatar_url: null
            }
          })) as EventApplication[];
          
          setApplications(typedApplications);
          console.log("Applications fetched:", typedApplications);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error('Error in fetchApplications:', error);
        toast.error("Erro ao carregar candidaturas");
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [eventId, user, userRole]);
  
  return { applications, loading };
};
