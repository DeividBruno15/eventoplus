
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';

/**
 * Hook to check if the current user has applied to an event
 */
export const useUserApplication = (eventId?: string, user?: User | null) => {
  const [loading, setLoading] = useState(true);
  const [userHasApplied, setUserHasApplied] = useState(false);
  const [userApplication, setUserApplication] = useState<EventApplication | null>(null);

  useEffect(() => {
    const checkUserApplication = async () => {
      if (!eventId || !user) {
        setLoading(false);
        setUserHasApplied(false);
        setUserApplication(null);
        return;
      }

      try {
        setLoading(true);
        
        // Query for the user's application to this event
        const { data, error } = await supabase
          .from('event_applications')
          .select('*, provider:provider_id(id, first_name, last_name, avatar_url)')
          .eq('event_id', eventId)
          .eq('provider_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
          console.error('Error checking user application:', error);
          throw error;
        }
        
        // Update state based on whether application was found
        setUserHasApplied(!!data);
        
        if (data) {
          console.log('User application data retrieved:', data);
          
          // Cast data to EventApplication to ensure correct structure
          setUserApplication(data as EventApplication);
          console.log('Current application status:', data.status);
        } else {
          setUserApplication(null);
        }
        
      } catch (error) {
        console.error('Error checking user application:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserApplication();
    
    // Set up realtime subscription to track application status changes
    const channel = supabase
      .channel('user-application-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'event_applications',
        filter: `provider_id=eq.${user?.id ?? ''} AND event_id=eq.${eventId ?? ''}`
      }, (payload) => {
        console.log('Application status changed in realtime:', payload);
        if (payload.new) {
          const newData = payload.new as any;
          console.log('Realtime update received with new status:', newData.status);
          
          // Ensure we have all necessary application data
          setUserApplication(prev => {
            if (!prev) return newData as EventApplication;
            
            // Merge the previous application data with the new data
            return {
              ...prev,
              ...newData,
              // Preserve provider info if it exists in previous state
              provider: prev.provider
            } as EventApplication;
          });
          
          setUserHasApplied(true);
        }
      })
      .subscribe();
    
    // Clean up subscription
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [eventId, user]);
  
  return { userHasApplied, userApplication, loading };
};
