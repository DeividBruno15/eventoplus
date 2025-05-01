
import { useState } from 'react';
import { Event } from '@/types/events';
import { toast } from 'sonner';
import { sendProviderNotification } from '../useEventNotifications';
import { updateApplicationStatus as updateAppStatus } from './utils/applicationStatus';

export const useApplicationRejection = (event: Event | null, onStatusUpdate?: (applicationId: string) => void) => {
  const [rejecting, setRejecting] = useState(false);

  /**
   * Rejects an application for an event
   */
  const handleRejectApplication = async (applicationId: string, providerId: string): Promise<void> => {
    if (!event) return;
    
    try {
      setRejecting(true);
      console.log('Rejecting application:', applicationId, 'for provider:', providerId);
      
      // Update the application status to rejected
      await updateAppStatus(applicationId, 'rejected');
      
      // Update local state to reflect the change immediately
      if (onStatusUpdate) {
        onStatusUpdate(applicationId);
      }
      
      // Send notification to provider
      try {
        await sendProviderNotification(
          event,
          providerId,
          "Candidatura rejeitada",
          `Sua candidatura para o evento "${event.name}" não foi aprovada.`,
          "application_rejected"
        );
        console.log('Rejection notification sent to provider:', providerId);
      } catch (notificationError) {
        console.error('Error sending rejection notification:', notificationError);
      }
      
      toast.success("Candidatura rejeitada com sucesso.");
    } catch (error: any) {
      console.error('Erro ao rejeitar candidatura:', error);
      toast.error(error.message || 'Ocorreu um erro ao rejeitar a candidatura');
    } finally {
      setRejecting(false);
    }
  };

  return {
    rejecting,
    handleRejectApplication
  };
};
