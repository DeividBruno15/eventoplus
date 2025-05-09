
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ApplicationApprovalConfig } from '../useApplicationApproval';
import { sendProviderNotification } from '../../useEventNotifications';
import { Event } from '@/types/events';

export const useApplicationApprovalHandler = (config: ApplicationApprovalConfig) => {
  const [approving, setApproving] = useState(false);
  const { toast } = useToast();
  const { eventId, onSuccess } = config;

  const handleApproveApplication = useCallback(async (applicationId: string, providerId: string) => {
    setApproving(true);

    try {
      console.log(`Approving application ${applicationId} for provider ${providerId}`);
      
      // Get event details first to include in notification
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) {
        console.error('Error fetching event details:', eventError);
        throw eventError;
      }
      
      const event = eventData as Event;
      
      // Update application status to accepted
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application status:', error);
        throw error;
      }
      
      console.log('Application approved successfully');

      // Send notification to the provider
      await sendProviderNotification(
        event,
        providerId,
        'Candidatura aprovada',
        `Sua candidatura para o evento "${event.name}" foi aprovada!`,
        'application_approved'
      );
      console.log(`Notification sent to provider ${providerId} about approval`);

      toast({
        title: 'Candidatura aprovada!',
        description: 'Prestador de serviço foi notificado.'
      });

      if (onSuccess) {
        await onSuccess(applicationId, providerId);
      }
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao aprovar candidatura',
        description: error.message || 'Houve um problema ao aprovar esta candidatura.'
      });
    } finally {
      setApproving(false);
    }
  }, [eventId, toast, onSuccess]);

  return { 
    approving, 
    handleApproveApplication 
  };
};
