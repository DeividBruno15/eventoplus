
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { sendApplicationNotification } from '../useEventNotifications';
import { Event } from '@/types/events';

export const useApplicationRejection = (eventId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rejecting, setRejecting] = useState(false);

  const notifyApplicant = useCallback(async (providerId: string, reason: string, eventName: string) => {
    await sendApplicationNotification(
      { id: eventId } as Event, // Simplificado para uso apenas com id
      providerId,
      'Candidatura rejeitada',
      `Sua candidatura para o evento "${eventName}" foi rejeitada. Motivo: ${reason || 'Não informado'}.`,
      'application_rejected'
    );
  }, [eventId]);

  const handleRejectApplication = useCallback(async (applicationId: string, providerId: string, reason: string = 'Candidatura não aprovada') => {
    setRejecting(true);
    
    try {
      console.log(`Rejecting application ${applicationId} for provider ${providerId}`);
      
      // Call RLS-enabled function to reject the application
      const { data: rejectResult, error: rejectError } = await supabase
        .rpc('reject_application', { 
          application_id: applicationId,
          rejection_text: reason || 'Candidatura não aprovada'
        });

      if (rejectError || !rejectResult) {
        throw rejectError || new Error('Falha ao rejeitar candidatura');
      }
      
      console.log('Application rejected successfully through RPC');
      
      // Get event details to include in notification
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('name')
        .eq('id', eventId)
        .single();

      if (eventError) {
        console.error('Error fetching event name:', eventError);
        throw eventError;
      }

      // Send notification to the provider about the rejection
      await notifyApplicant(providerId, reason, eventData.name);
      console.log(`Notification sent to provider ${providerId} about rejection`);
      
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
