
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventApplication } from '@/types/events';

export const useFetchApplications = (eventId: string) => {
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('event_applications')
          .select(`
            *,
            provider:provider_id (
              id,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('event_id', eventId)
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw new Error(`Error fetching applications: ${fetchError.message}`);
        }

        if (!data) {
          setApplications([]);
          return;
        }

        // Transform the data to match EventApplication interface
        const formattedApplications: EventApplication[] = data.map(app => {
          // Ensure the status is one of the allowed types
          let typedStatus: "pending" | "accepted" | "rejected" = "pending";
          
          if (app.status === "accepted") {
            typedStatus = "accepted";
          } else if (app.status === "rejected") {
            typedStatus = "rejected";
          }
          
          return {
            id: app.id,
            event_id: app.event_id,
            provider_id: app.provider_id,
            status: typedStatus,
            message: app.message,
            service_category: app.service_category || '',
            created_at: app.created_at || '',
            rejection_reason: app.rejection_reason || '',
            provider: app.provider ? {
              id: app.provider.id,
              first_name: app.provider.first_name,
              last_name: app.provider.last_name,
              avatar_url: app.provider.avatar_url
            } : undefined
          };
        });

        setApplications(formattedApplications);
      } catch (err) {
        console.error('Error in useFetchApplications:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching applications'));
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchApplications();
    }
  }, [eventId]);

  return { applications, loading, error, refetch: () => {} };
};
