
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { EventApplication } from '@/types/events';
import { useFetchUserApplication } from './useFetchUserApplication';
import { useApplicationRealtimeUpdates } from './useApplicationRealtimeUpdates';

/**
 * Hook to check if the current user has applied to an event and handle realtime updates
 */
export const useUserApplication = (eventId?: string, user?: User | null) => {
  // Use the fetch hook for initial data loading
  const { 
    loading, 
    userHasApplied, 
    userApplication, 
    setUserApplication, 
    setUserHasApplied 
  } = useFetchUserApplication(eventId, user);

  // Use the realtime updates hook for realtime subscriptions
  useApplicationRealtimeUpdates({
    eventId,
    user,
    setUserApplication,
    setUserHasApplied
  });
  
  // Debug logging
  useEffect(() => {
    if (userApplication) {
      console.log('Current user application status:', userApplication.status);
    }
  }, [userApplication]);
  
  return { userHasApplied, userApplication, loading };
};
