import { useState, useEffect, useCallback } from 'react';
import { EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';
import { useFetchApplications } from './useFetchApplications';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches applications for an event when user is the contractor
 */
export const useEventApplicationsList = (eventId?: string, user?: User | null, userRole?: 'provider' | 'contractor' | null) => {
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const { loading, fetchApplications } = useFetchApplications();
  
  // Lista local de IDs de candidaturas rejeitadas para evitar que reapareçam
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  
  // Function to update application status locally
  const updateApplicationStatus = useCallback((applicationId: string, status: 'accepted' | 'rejected') => {
    console.log(`Updating application status locally in useEventApplicationsList: ${applicationId} to ${status}`);
    
    if (status === 'rejected') {
      // Adicionar à lista de rejeitados para garantir que não volte
      setRejectedIds(prev => {
        const newSet = new Set(prev);
        newSet.add(applicationId);
        return newSet;
      });
      
      // Remover da lista de aplicações
      setApplications(prevApplications => 
        prevApplications.filter(app => app.id !== applicationId)
      );
      
      // Persistir os IDs rejeitados no localStorage para que não voltem mesmo após recarregar a página
      try {
        // Obter IDs rejeitados existentes
        const storedRejectedIds = localStorage.getItem(`rejected_apps_${eventId}`) || '[]';
        const rejectedArray = JSON.parse(storedRejectedIds);
        
        // Adicionar o novo ID se não estiver já incluído
        if (!rejectedArray.includes(applicationId)) {
          rejectedArray.push(applicationId);
          localStorage.setItem(`rejected_apps_${eventId}`, JSON.stringify(rejectedArray));
        }
        
        console.log(`ID de candidatura ${applicationId} adicionado à lista de rejeições persistente`);
      } catch (err) {
        console.warn('Erro ao salvar ID rejeitado no localStorage:', err);
      }
    } else {
      // Para outras atualizações de status, apenas atualizar o estado local
      setApplications(prevApplications => {
        const updated = prevApplications.map(app => 
          app.id === applicationId ? { ...app, status } : app
        );
        console.log('Updated applications array:', updated);
        return updated;
      });
    }
  }, [eventId]);
  
  // Carregar IDs rejeitados do localStorage na inicialização
  useEffect(() => {
    if (!eventId) return;
    
    try {
      const storedRejectedIds = localStorage.getItem(`rejected_apps_${eventId}`);
      if (storedRejectedIds) {
        const rejectedArray = JSON.parse(storedRejectedIds);
        console.log('Carregando IDs rejeitados do localStorage:', rejectedArray);
        
        setRejectedIds(new Set(rejectedArray));
      }
    } catch (err) {
      console.warn('Erro ao carregar IDs rejeitados do localStorage:', err);
    }
  }, [eventId]);
  
  // Force refresh applications
  const refreshApplications = useCallback(async () => {
    if (!eventId || !user || (userRole !== 'contractor' && user.user_metadata?.role !== 'contractor')) {
      return;
    }
    
    try {
      console.log('Manually refreshing applications...');
      const freshApplications = await fetchApplications(eventId, user);
      console.log('Refreshed applications before filtering:', freshApplications.length);
      
      // Filtrar aplicações rejeitadas usando a lista local
      const filteredApplications = freshApplications.filter(app => !rejectedIds.has(app.id));
      console.log('Refreshed applications after filtering rejections:', filteredApplications.length);
      
      setApplications(filteredApplications);
    } catch (error) {
      console.error('Error refreshing applications:', error);
    }
  }, [eventId, user, userRole, fetchApplications, rejectedIds]);
  
  // Fetch applications initially and setup realtime subscription
  useEffect(() => {
    const getApplications = async () => {
      if (!eventId || !user) return;
      
      // Only contractors need to fetch all applications
      if ((userRole !== 'contractor' && user.user_metadata?.role !== 'contractor')) {
        return;
      }
      
      try {
        console.log(`Fetching applications for event: ${eventId}`);
        const fetchedApplications = await fetchApplications(eventId, user);
        console.log('Fetched applications before filtering:', fetchedApplications.length);
        
        // Filtrar aplicações rejeitadas usando a lista local
        const filteredApplications = fetchedApplications.filter(app => !rejectedIds.has(app.id));
        console.log('Fetched applications after filtering rejections:', filteredApplications.length);
        
        setApplications(filteredApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    
    getApplications();
    
    // Set up realtime subscription for application updates
    const channel = supabase
      .channel(`event_applications_changes_${eventId}`)
      .on('postgres_changes', 
        { 
          event: '*', // Mudar para capturar todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public', 
          table: 'event_applications',
          filter: eventId ? `event_id=eq.${eventId}` : undefined
        }, 
        (payload) => {
          console.log('Realtime update received for application:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new) {
            // Para atualizações
            const updatedApp = payload.new as any;
            
            // Verificar se a aplicação está na lista de rejeitados
            if (rejectedIds.has(updatedApp.id)) {
              console.log(`Ignorando atualização para aplicação rejeitada ${updatedApp.id}`);
              return;
            }
            
            console.log('Updating application in realtime with new status:', updatedApp.status);
            
            // Atualização mais robusta que preserva dados estendidos
            setApplications(currentApps => {
              return currentApps.map(app => {
                if (app.id === updatedApp.id) {
                  return {
                    ...app,                  // Mantém dados estendidos como provider
                    ...updatedApp,           // Sobrescreve com novos dados
                    status: updatedApp.status // Garante que o status seja atualizado
                  };
                }
                return app;
              });
            });
            
            console.log('Application updated in realtime');
          } else if (payload.eventType === 'DELETE' && payload.old) {
            // Para exclusões
            const deletedApp = payload.old as any;
            setApplications(currentApps => 
              currentApps.filter(app => app.id !== deletedApp.id)
            );
          } else if (payload.eventType === 'INSERT' && payload.new) {
            // Para inserções, fazer uma busca completa para garantir que temos todos os dados relacionados
            const newApp = payload.new as any;
            
            // Verificar se a nova aplicação está na lista de rejeitados
            if (rejectedIds.has(newApp.id)) {
              console.log(`Ignorando inserção para aplicação rejeitada ${newApp.id}`);
              return;
            }
            
            refreshApplications();
          }
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
      });
    
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [eventId, user, userRole, fetchApplications, refreshApplications, rejectedIds]);
  
  return { applications, loading, updateApplicationStatus, refreshApplications };
};
