
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useApplicationApprovalHandler } from './hooks/useApplicationApprovalHandler';
import { sendNotification } from '@/services/notifications';
import { Event } from '@/types/events';
import { createConversation } from './utils/conversation';

export interface ApplicationApprovalConfig {
  eventId: string;
  onSuccess?: (applicationId: string, providerId: string) => Promise<void>;
}

export const useApplicationApproval = (eventId: string) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const notifyApplicant = useCallback(async (providerId: string, eventName: string) => {
    await sendNotification({
      userId: providerId,
      title: 'Candidatura aprovada!',
      content: `Sua candidatura para o evento "${eventName}" foi aprovada.`,
      type: 'application_accepted',
      link: `/events/${eventId}`
    });
  }, [eventId]);

  const handleSuccessfulApproval = useCallback(async (applicationId: string, providerId: string) => {
    try {
      // Get event details to include in notification
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) {
        throw eventError;
      }

      // Convert to Event type with type assertion and handle the service_requests property
      const event = {
        ...eventData,
        service_requests: eventData.service_requests ? 
          (Array.isArray(eventData.service_requests) ? 
            eventData.service_requests : 
            []
          ) : 
          []
      } as unknown as Event;

      // Create conversation between contractor and provider
      if (user && event.contractor_id && providerId) {
        await createConversation(user.id, providerId);
      }

      // Send notification to the provider
      await notifyApplicant(providerId, event.name);
    } catch (error) {
      console.error('Error in post-approval processing:', error);
    }
  }, [eventId, user, notifyApplicant]);

  const config: ApplicationApprovalConfig = {
    eventId,
    onSuccess: handleSuccessfulApproval
  };

  const { approving, handleApproveApplication } = useApplicationApprovalHandler(config);

  return {
    approving,
    handleApproveApplication
  };
};
