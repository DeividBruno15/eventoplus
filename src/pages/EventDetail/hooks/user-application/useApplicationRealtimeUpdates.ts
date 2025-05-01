
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';

interface RealtimeUpdateProps {
  eventId?: string;
  user?: User | null;
  setUserApplication: (application: EventApplication) => void;
  setUserHasApplied: (hasApplied: boolean) => void;
}

export const useApplicationRealtimeUpdates = ({
  eventId,
  user,
  setUserApplication,
  setUserHasApplied
}: RealtimeUpdateProps) => {
  useEffect(() => {
    // Only subscribe if we have both user and eventId
    if (!user?.id || !eventId) return;
    
    console.log('Subscribing to Realtime with:', { userId: user?.id, eventId });
    
    // Set up realtime subscription to track application status changes
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
              // Format application data and update state
              const formattedApplication = formatRealtimeApplicationData(data);
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
  }, [eventId, user, setUserApplication, setUserHasApplied]);
};

// Helper function to format application data from realtime updates
const formatRealtimeApplicationData = (data: any): EventApplication => {
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
  
  // Create a properly formatted EventApplication object
  return {
    id: data.id,
    provider_id: data.provider_id,
    event_id: data.event_id,
    status: status,
    service_category: data.service_category,
    message: data.message,
    created_at: data.created_at,
    provider: providerData
  };
};
