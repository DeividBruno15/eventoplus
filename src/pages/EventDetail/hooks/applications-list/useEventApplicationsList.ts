
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
  
  // Function to update application status locally
  const updateApplicationStatus = useCallback((applicationId: string, status: 'accepted' | 'rejected' = 'accepted') => {
    console.log(`Updating application status locally: ${applicationId} to ${status}`);
    setApplications(prevApplications => {
      return prevApplications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      );
    });
  }, []);
  
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
        console.log('Fetched applications:', fetchedApplications);
        setApplications(fetchedApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    
    getApplications();
    
    // Set up realtime subscription for application updates
    const channel = supabase
      .channel('event_applications_changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'event_applications',
          filter: eventId ? `event_id=eq.${eventId}` : undefined
        }, 
        (payload) => {
          console.log('Realtime update received for application:', payload);
          if (payload.new && payload.new.id) {
            const updatedApp = payload.new as EventApplication;
            setApplications(currentApps => 
              currentApps.map(app => 
                app.id === updatedApp.id ? {...app, ...updatedApp} : app
              )
            );
          }
        }
      )
      .subscribe();
    
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [eventId, user, userRole, fetchApplications]);
  
  return { applications, loading, updateApplicationStatus };
};
