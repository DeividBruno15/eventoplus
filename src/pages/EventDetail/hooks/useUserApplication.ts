
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
        
        // Ensure we have a properly formatted provider object to satisfy the type
        if (data) {
          // If the provider data doesn't have the expected structure, create a default one
          if (!data.provider || typeof data.provider !== 'object' || !('id' in (data.provider || {}))) {
            const application = {
              ...data,
              provider: {
                id: user.id,
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || '',
                avatar_url: user.user_metadata?.avatar_url || null
              }
            } as EventApplication;
            setUserApplication(application);
          } else {
            // Data is already in the correct format
            setUserApplication(data as EventApplication);
          }
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
        console.log('Application status changed:', payload);
        if (payload.new) {
          // Update the local application state with the new data and ensure provider is properly formatted
          const updatedApplication = {
            ...payload.new,
            provider: userApplication?.provider || {
              id: user?.id || '',
              first_name: user?.user_metadata?.first_name || '',
              last_name: user?.user_metadata?.last_name || '',
              avatar_url: user?.user_metadata?.avatar_url || null
            }
          } as unknown as EventApplication;
          setUserApplication(updatedApplication);
        }
      })
      .subscribe();
    
    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, user]);
  
  return { userHasApplied, userApplication, loading };
};
