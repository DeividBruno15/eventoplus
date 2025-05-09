
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
    
    console.log('Setting up realtime updates for application status with:', { userId: user.id, eventId });
    
    // Set up realtime subscription to track application status changes
    const channel = supabase
      .channel(`user-application-changes-${user.id}-${eventId}`)
      .on('postgres_changes', 
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'event_applications',
          filter: `provider_id=eq.${user.id} AND event_id=eq.${eventId}`
        }, 
        async (payload) => {
          console.log('Realtime update received for application:', payload);
          
          if (payload.new) {
            try {
              // Retrive the full application data with provider info
              const { data, error } = await supabase
                .from('event_applications')
                .select(`
                  id, 
                  provider_id, 
                  event_id, 
                  status, 
                  service_category, 
                  message, 
                  created_at
                `)
                .eq('id', payload.new.id)
                .single();
                
              if (error) throw error;
              
              if (data) {
                const formattedApplication = {
                  ...data,
                  status: data.status as "pending" | "accepted" | "rejected"
                } as EventApplication;
                
                console.log('Updated application with realtime data:', formattedApplication);
                setUserApplication(formattedApplication);
                setUserHasApplied(true);
              }
            } catch (error) {
              console.error('Error fetching complete application data:', error);
            }
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'event_applications',
          filter: `provider_id=eq.${user.id} AND event_id=eq.${eventId}`
        },
        (payload) => {
          console.log('Application deleted:', payload);
          setUserHasApplied(false);
          setUserApplication(null as any);
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for applications: ${status}`);
      });
    
    return () => {
      console.log('Cleaning up realtime subscription for applications');
      supabase.removeChannel(channel);
    };
  }, [eventId, user, setUserApplication, setUserHasApplied]);
};
