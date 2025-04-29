
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventApplication } from '@/types/events';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

/**
 * Hook for fetching applications for an event
 */
export const useFetchApplications = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Fetches applications for a specific event
   */
  const fetchApplications = async (
    eventId: string, 
    user: User
  ): Promise<EventApplication[]> => {
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
        return [];
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
          return [];
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
        
        console.log("Applications fetched:", typedApplications);
        return typedApplications;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error in fetchApplications:', error);
      toast.error("Erro ao carregar candidaturas");
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    fetchApplications
  };
};
