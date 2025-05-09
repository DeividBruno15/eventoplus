
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useEventDetails } from './useEventDetails';
import { useEventApplications } from './useEventApplications';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useEventState = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  
  const { 
    event, 
    applications, 
    userRole, 
    loading, 
    userHasApplied, 
    userApplication,
    refetchEvent: originalRefetchEvent,
    updateApplicationStatus
  } = useEventDetails({ id, user });
  
  const { 
    submitting, 
    handleApply, 
    handleApproveApplication,
    handleCancelApplication,
    handleRejectApplication
  } = useEventApplications(event, updateApplicationStatus);
  
  console.log("Applications in useEventState:", applications);
  
  // Para debugging - monitorar alterações na aplicação do usuário
  useEffect(() => {
    if (userApplication) {
      console.log("User application status in useEventState:", userApplication.status);
    }
  }, [userApplication]);

  // Configure realtime subscription for event applications
  useEffect(() => {
    if (!id) return;
    
    console.log(`Setting up realtime subscription for event: ${id}`);
    
    const channel = supabase
      .channel(`event_applications_${id}`)
      .on('postgres_changes', 
        { 
          event: '*', // Listen for all event types
          schema: 'public', 
          table: 'event_applications',
          filter: `event_id=eq.${id}`
        }, 
        (payload) => {
          console.log('Realtime update for event applications:', payload);
          // Trigger a refetch when any application changes
          setRefetchTrigger(prev => prev + 1);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // Force refetch when the refetch trigger changes
  useEffect(() => {
    if (refetchTrigger > 0) {
      console.log('Refetch trigger changed, refetching event data');
      originalRefetchEvent();
    }
  }, [refetchTrigger, originalRefetchEvent]);

  const refetchEvent = useCallback(() => {
    console.log('Manual refetchEvent called');
    setRefetchTrigger(prev => prev + 1);
    originalRefetchEvent();
  }, [originalRefetchEvent]);

  return {
    id,
    user,
    event,
    applications,
    userRole,
    loading,
    userHasApplied,
    userApplication,
    refetchEvent,
    submitting,
    handleApply,
    handleApproveApplication,
    handleCancelApplication,
    handleRejectApplication
  };
};
