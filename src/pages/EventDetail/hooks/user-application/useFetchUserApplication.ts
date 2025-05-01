
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';

export const useFetchUserApplication = (eventId?: string, user?: User | null) => {
  const [loading, setLoading] = useState(true);
  const [userHasApplied, setUserHasApplied] = useState(false);
  const [userApplication, setUserApplication] = useState<EventApplication | null>(null);

  useEffect(() => {
    const fetchUserApplication = async () => {
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
          
          // Create a formatted application object with proper typing
          const formattedApplication = formatApplicationData(data);
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
    
    fetchUserApplication();
  }, [eventId, user]);
  
  return { loading, userHasApplied, userApplication, setUserApplication, setUserHasApplied };
};

// Helper function to format application data
const formatApplicationData = (data: any): EventApplication => {
  // Ensure status is properly typed
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
