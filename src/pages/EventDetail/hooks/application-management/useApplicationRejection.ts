
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { sendNotification } from '@/services/notifications';
import { Event } from '@/types/events';

export const useApplicationRejection = (eventId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rejecting, setRejecting] = useState(false);

  const notifyApplicant = useCallback(async (providerId: string, reason: string, eventName: string) => {
    await sendNotification({
      userId: providerId,
      title: 'Candidatura rejeitada',
      content: `Sua candidatura para o evento "${eventName}" foi rejeitada. Motivo: ${reason || 'Não informado'}.`,
      type: 'application_rejected',
      link: `/events/${eventId}`
    });
  }, [eventId]);

  const handleRejectApplication = useCallback(async (applicationId: string, providerId: string, reason: string) => {
    setRejecting(true);
    
    try {
      // Call RLS-enabled function to reject the application
      const { data: rejectResult, error: rejectError } = await supabase
        .rpc('reject_application', { 
          application_id: applicationId,
          rejection_text: reason || 'Candidatura não aprovada'
        });

      if (rejectError || !rejectResult) {
        throw rejectError || new Error('Falha ao rejeitar candidatura');
      }
      
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

      // Send notification to the provider
      await notifyApplicant(providerId, reason, event.name);
      
      toast({
        title: 'Candidatura rejeitada',
        description: 'O prestador foi notificado sobre a rejeição.'
      });
      
    } catch (error: any) {
      console.error('Error rejecting application:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao rejeitar candidatura',
        description: error.message || 'Houve um problema ao rejeitar esta candidatura.'
      });
    } finally {
      setRejecting(false);
    }
  }, [user, eventId, toast, notifyApplicant]);

  return {
    rejecting,
    handleRejectApplication
  };
};
