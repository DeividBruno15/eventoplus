
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

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
          .select('*, provider:user_profiles!provider_id(id, first_name, last_name, avatar_url)')
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
          
          // Create a properly typed EventApplication object, ensuring status is properly typed
          const status = data.status as "pending" | "accepted" | "rejected";
          
          // Create a formatted provider object with null checks
          let providerData = undefined;
          
          // First verify that provider exists and is an object
          if (data.provider && typeof data.provider === 'object') {
            // Create a safe object for accessing properties
            const safeProvider: Record<string, any> = data.provider;
            
            // Check if it has all required properties before attempting to use them
            if (safeProvider && 
                typeof safeProvider.id === 'string' && 
                typeof safeProvider.first_name === 'string' && 
                typeof safeProvider.last_name === 'string') {
              
              // Now we can safely create the provider data object
              providerData = {
                id: safeProvider.id,
                first_name: safeProvider.first_name,
                last_name: safeProvider.last_name,
                avatar_url: safeProvider.avatar_url as string | undefined
              };
            }
          }
          
          // Create a properly formatted EventApplication object with proper type casting
          const formattedApplication: EventApplication = {
            id: data.id,
            provider_id: data.provider_id,
            event_id: data.event_id,
            status: status,
            service_category: data.service_category,
            message: data.message,
            created_at: data.created_at,
            provider: providerData
          };
          
          setUserApplication(formattedApplication);
          console.log('Current application status:', formattedApplication.status);
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
    console.log('Subscribing to Realtime with:', { userId: user?.id, eventId });
    
    const channel = supabase
      .channel('user-application-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'event_applications'
      }, async (payload) => {
        // Manual filtering in the callback instead of using filter in the channel config
        const newData = payload.new as any;
        console.log('Realtime update received:', payload);
        
        // Only process updates relevant to this user and event
        if (newData && 
            newData.provider_id === user?.id && 
            newData.event_id === eventId) {
            
          console.log('Application status changed in realtime:', payload);
          console.log('Realtime update received with new status:', newData.status);
          
          // When we get a realtime update, fetch the complete application data with provider info
          try {
            const { data } = await supabase
              .from('event_applications')
              .select('*, provider:user_profiles!provider_id(id, first_name, last_name, avatar_url)')
              .eq('id', newData.id)
              .single();
              
            if (data) {
              // Ensure status is properly typed
              const status = data.status as "pending" | "accepted" | "rejected";
              
              // Create a formatted provider object with null checks
              let providerData = undefined;
              
              // Use the same safe approach for the realtime data
              if (data.provider && typeof data.provider === 'object') {
                // Create a safe object for accessing properties
                const safeProvider: Record<string, any> = data.provider;
                
                // Check if it has all required properties before attempting to use them
                if (safeProvider && 
                    typeof safeProvider.id === 'string' && 
                    typeof safeProvider.first_name === 'string' && 
                    typeof safeProvider.last_name === 'string') {
                  
                  // Now we can safely create the provider data object
                  providerData = {
                    id: safeProvider.id,
                    first_name: safeProvider.first_name,
                    last_name: safeProvider.last_name,
                    avatar_url: safeProvider.avatar_url as string | undefined
                  };
                }
              }
              
              // Create a properly formatted EventApplication object with proper type checking
              const formattedApplication: EventApplication = {
                id: data.id,
                provider_id: data.provider_id,
                event_id: data.event_id,
                status: status,
                service_category: data.service_category,
                message: data.message,
                created_at: data.created_at,
                provider: providerData
              };
              
              setUserApplication(formattedApplication);
              setUserHasApplied(true);
              console.log('Updated application with provider data:', formattedApplication);
            }
          } catch (error) {
            console.error('Error fetching complete application data:', error);
          }
        }
      })
      .subscribe();
    
    // Debug channel to monitor ALL application updates (temporary)
    const debugChannel = supabase
      .channel('debug-applications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'event_applications'
      }, (payload) => {
        console.log('DEBUG - Payload recebido:', payload);
      })
      .subscribe();
    
    // Clean up subscription
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
      supabase.removeChannel(debugChannel);
    };
  }, [eventId, user]);
  
  return { userHasApplied, userApplication, loading };
};
