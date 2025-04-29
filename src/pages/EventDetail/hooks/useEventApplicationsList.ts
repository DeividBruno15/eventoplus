
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
          .eq('event_id', eventId)
          .order('created_at', { ascending: false });
          
        if (appsError) {
          console.error('Error fetching applications:', appsError);
          toast.error("Erro ao carregar candidaturas");
          return;
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
      } catch (error) {
        console.error('Error in fetchApplications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [eventId, user, userRole]);
  
  return { applications };
};
