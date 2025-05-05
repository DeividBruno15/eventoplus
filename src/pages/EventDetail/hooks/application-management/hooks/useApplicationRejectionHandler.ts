
import { useState } from 'react';
import { Event } from '@/types/events';
import { useApplicationRejection } from '../useApplicationRejection';

/**
 * Hook that provides functionality for rejecting applications
 */
export const useApplicationRejectionHandler = (
  event: Event | null, 
  updateCallback?: (applicationId: string, status: 'accepted' | 'rejected') => void
) => {
  const eventId = event?.id || '';
  const { 
    rejecting, 
    handleRejectApplication: originalHandleReject 
  } = useApplicationRejection(eventId);

  // Wrapper para adicionar logs específicos para rejeição
  const handleRejectApplication = async (applicationId: string, providerId: string, reason?: string): Promise<void> => {
    console.log(`[RejectHandler] Iniciando rejeição de candidatura ${applicationId}${reason ? ` com motivo: ${reason}` : ''}`);
    try {
      await originalHandleReject(applicationId, providerId, reason);
      console.log(`[RejectHandler] Rejeição de candidatura ${applicationId} bem-sucedida`);
      
      // Notificar callback externo para que a UI seja atualizada
      if (updateCallback) {
        console.log(`Notificando callback externo sobre rejeição de ${applicationId}`);
        updateCallback(applicationId, 'rejected');
      }
    } catch (error) {
      console.error(`[RejectHandler] Erro ao rejeitar candidatura ${applicationId}:`, error);
      throw error; // Propagar erro para tratamento superior
    }
  };

  return {
    rejecting,
    handleRejectApplication
  };
};
