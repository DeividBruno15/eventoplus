
import { useState, useEffect, useCallback } from 'react';
import { EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';
import { useFetchApplications } from './useFetchApplications';

/**
 * Fetches applications for an event when user is the contractor
 */
export const useEventApplicationsList = (eventId?: string, user?: User | null, userRole?: 'provider' | 'contractor' | null) => {
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const { loading, fetchApplications } = useFetchApplications();
  
  // Function to update application status locally
  const updateApplicationStatus = useCallback((applicationId: string, status: 'accepted' | 'rejected') => {
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      )
    );
  }, []);
  
  useEffect(() => {
    const getApplications = async () => {
      if (!eventId || !user) return;
      
      // Only contractors need to fetch all applications
      if ((userRole !== 'contractor' && user.user_metadata?.role !== 'contractor')) {
        return;
      }
      
      const fetchedApplications = await fetchApplications(eventId, user);
      setApplications(fetchedApplications);
    };
    
    getApplications();
  }, [eventId, user, userRole, fetchApplications]);
  
  return { applications, loading, updateApplicationStatus };
};
