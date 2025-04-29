
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';

/**
 * Manages the user's application to a specific event
 */
export const useUserApplication = (eventId?: string, user?: User | null) => {
  const [userHasApplied, setUserHasApplied] = useState(false);
  const [userApplication, setUserApplication] = useState<EventApplication | null>(null);

  useEffect(() => {
    const fetchUserApplication = async () => {
      if (!eventId || !user) return;
      
      try {
        // Get current user's application if any
        const { data: userAppData, error: userAppError } = await supabase
          .from('event_applications')
          .select('*')
          .eq('event_id', eventId)
          .eq('provider_id', user.id)
          .limit(1);
          
        if (userAppError) {
          console.error('Error fetching user application:', userAppError);
          return;
        }
          
        if (userAppData && userAppData.length > 0) {
          setUserHasApplied(true);
          setUserApplication(userAppData[0] as EventApplication);
          console.log("User has applied to this event:", userAppData[0]);
        } else {
          setUserHasApplied(false);
          setUserApplication(null);
        }
      } catch (error) {
        console.error('Error in fetchUserApplication:', error);
      }
    };
    
    fetchUserApplication();
  }, [eventId, user]);
  
  return {
    userHasApplied,
    userApplication
  };
};
