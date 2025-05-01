
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
          
          // Create a properly formatted application object regardless of the provider data structure
          const applicationData = {
            ...data,
            provider: {
              id: user.id,
              first_name: user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.last_name || '',
              avatar_url: user.user_metadata?.avatar_url || null
            }
          };
          
          console.log('Current application status:', applicationData.status);
          
          // Use type assertion since we're ensuring the structure is compatible
          setUserApplication(applicationData as EventApplication);
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
          // Always create a properly formatted application object for consistency
          const updatedApplication = {
            ...payload.new,
            provider: {
              id: user?.id || '',
              first_name: user?.user_metadata?.first_name || '',
              last_name: user?.user_metadata?.last_name || '',
              avatar_url: user?.user_metadata?.avatar_url || null
            }
          };
          
          console.log('Updated application status via realtime:', updatedApplication.status);
          
          // Use type assertion since we're ensuring the structure is compatible
          setUserApplication(updatedApplication as EventApplication);
          setUserHasApplied(true);
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
