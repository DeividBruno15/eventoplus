import { useState, useCallback } from 'react';
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
   * Obtém IDs de candidaturas rejeitadas do localStorage
   */
  const getRejectedIds = useCallback((eventId: string) => {
    try {
      const storedRejectedIds = localStorage.getItem(`rejected_apps_${eventId}`);
      if (storedRejectedIds) {
        return new Set(JSON.parse(storedRejectedIds));
      }
    } catch (err) {
      console.warn('Erro ao carregar IDs rejeitados do localStorage:', err);
    }
    return new Set();
  }, []);

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
      
      // Obter IDs de candidaturas rejeitadas
      const rejectedIds = getRejectedIds(eventId);
      console.log(`Encontrados ${rejectedIds.size} IDs de candidaturas rejeitadas para filtrar`);
      
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
      
      if (!appsData || appsData.length === 0) {
        console.log('No applications found for this event');
        return [];
      }
      
      // Filtrar candidaturas rejeitadas
      const filteredApps = appsData.filter(app => !rejectedIds.has(app.id));
      console.log(`Filtradas ${appsData.length - filteredApps.length} candidaturas rejeitadas`);
      
      // Buscar os perfis dos prestadores
      const { data: providerProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', filteredApps.map(app => app.provider_id));
        
      if (profilesError) {
        console.error('Error fetching provider profiles:', profilesError);
        // Continuar sem os dados dos perfis
      }
      
      // Mapear os perfis por ID
      const profilesMap = new Map();
      if (providerProfiles) {
        providerProfiles.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }
      
      // Juntar os dados das candidaturas com os perfis
      const enrichedApplications = filteredApps.map(app => ({
        ...app,
        provider: profilesMap.get(app.provider_id) || null
      }));
      
      return enrichedApplications;
    } catch (error) {
      console.error('Error in fetchApplications:', error);
      toast.error("Erro ao carregar candidaturas");
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, fetchApplications };
};
