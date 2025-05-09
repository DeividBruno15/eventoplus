
import { useState, useCallback } from 'react';
import { Event } from '@/types/events';
import { useApplicationRejection } from '../useApplicationRejection';
import { supabase } from '@/integrations/supabase/client';
import { sendProviderNotification } from '../../useEventNotifications';

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

  // Wrapper para adicionar logs específicos para rejeição e uso direto do Supabase
  const handleRejectApplication = async (applicationId: string, providerId: string, reason?: string): Promise<void> => {
    console.log(`[RejectHandler] Iniciando rejeição de candidatura ${applicationId}${reason ? ` com motivo: ${reason}` : ''}`);
    
    try {
      if (!event) {
        throw new Error('Event information is missing');
      }
      
      // Update application status directly
      const { error: updateError } = await supabase
        .from('event_applications')
        .update({ 
          status: 'rejected',
          rejection_reason: reason || 'Candidatura não aprovada'
        })
        .eq('id', applicationId);
      
      if (updateError) {
        console.error(`[RejectHandler] Error updating application status: ${updateError.message}`);
        throw updateError;
      }
      
      console.log(`[RejectHandler] Application ${applicationId} marked as rejected in database`);
      
      // Send notification to provider
      await sendProviderNotification(
        event,
        providerId,
        'Candidatura rejeitada',
        `Sua candidatura para o evento "${event.name}" foi rejeitada. ${reason ? `Motivo: ${reason}` : ''}`,
        'application_rejected'
      );
      
      console.log(`[RejectHandler] Rejection notification sent to provider ${providerId}`);
      
      // Log the rejection in the rejection log table
      const { error: logError } = await supabase
        .from('event_rejection_log')
        .insert({
          application_id: applicationId,
          event_id: event.id,
          provider_id: providerId,
          reason: reason || 'Candidatura não aprovada',
          applied_to_main_table: true
        });
      
      if (logError) {
        console.warn(`[RejectHandler] Error logging rejection: ${logError.message}`);
        // Non-critical error, continue
      } else {
        console.log(`[RejectHandler] Rejection logged to event_rejection_log`);
      }
      
      // Notify callback for UI updates
      if (updateCallback) {
        console.log(`[RejectHandler] Notifying callback about rejection of ${applicationId}`);
        updateCallback(applicationId, 'rejected');
      }
      
      console.log(`[RejectHandler] Rejection of application ${applicationId} completed successfully`);
    } catch (error) {
      console.error(`[RejectHandler] Error rejecting application ${applicationId}:`, error);
      throw error; // Propagar erro para tratamento superior
    }
  };

  return {
    rejecting,
    handleRejectApplication
  };
};
