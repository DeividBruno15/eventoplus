
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/events';
import { toast } from 'sonner';
import { sendProviderNotification } from './useEventNotifications';

export const useApplicationManagement = (event: Event | null) => {
  const [submitting, setSubmitting] = useState(false);

  /**
   * Rejects an application for an event
   */
  const handleRejectApplication = async (applicationId: string, providerId: string): Promise<void> => {
    if (!event) return;
    
    try {
      setSubmitting(true);
      console.log('Rejecting application:', applicationId, 'for provider:', providerId);
      
      // Update the application status to rejected
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);
        
      if (error) {
        console.error('Error rejecting application:', error);
        throw error;
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
      
      // Refresh the page
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      console.error('Erro ao rejeitar candidatura:', error);
      toast.error(error.message || 'Ocorreu um erro ao rejeitar a candidatura');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Approves an application for an event
   */
  const handleApproveApplication = async (applicationId: string, providerId: string): Promise<void> => {
    if (!event) return;
    
    try {
      setSubmitting(true);
      console.log('Approving application:', applicationId, 'for provider:', providerId);
      
      // Get the application to determine which service it's for
      const { data: applicationData, error: appError } = await supabase
        .from('event_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
        
      if (appError) {
        console.error('Error fetching application details:', appError);
        throw appError;
      }
      
      // Approve this application
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);
        
      if (error) {
        console.error('Error approving application:', error);
        throw error;
      }
      
      // Mark other applications as rejected for this service category if specified
      if (applicationData.service_category) {
        await supabase
          .from('event_applications')
          .update({ status: 'rejected' })
          .eq('event_id', event.id)
          .eq('service_category', applicationData.service_category)
          .neq('id', applicationId);
          
        console.log('Rejected other applications for service category:', applicationData.service_category);
      } else {
        // If no service category, reject all other applications for this event
        await supabase
          .from('event_applications')
          .update({ status: 'rejected' })
          .eq('event_id', event.id)
          .neq('id', applicationId);
          
        console.log('Rejected all other applications for this event');
      }
      
      // Update event status to published if it's not already
      if (event.status !== 'published') {
        await supabase
          .from('events')
          .update({ status: 'published' })
          .eq('id', event.id);
          
        console.log('Updated event status to published');
      }
      
      // Create a conversation for them to chat
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          service_request_id: null
        })
        .select()
        .single();
      
      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw conversationError;
      }
      
      // Add both participants to the conversation
      await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: event.contractor_id },
          { conversation_id: conversation.id, user_id: providerId }
        ]);
        
      console.log('Created conversation and added participants');
      
      // Send notification to provider
      try {
        await sendProviderNotification(
          event,
          providerId,
          "Parabéns! Você foi aprovado para um evento",
          `Sua candidatura para o evento "${event.name}" foi aprovada!`,
          "application_approved"
        );
        console.log('Approval notification sent to provider:', providerId);
      } catch (notificationError) {
        console.error('Error sending approval notification:', notificationError);
      }
      
      toast.success("Candidatura aprovada! Você e o prestador já podem conversar.");
      
      // Increment the filled count for this service in service_requests
      if (event.service_requests && event.service_requests.length > 0 && applicationData.service_category) {
        // Get current service_requests
        const updatedServiceRequests = [...event.service_requests].map(req => {
          if (req.category === applicationData.service_category) {
            return {
              ...req,
              filled: (req.filled || 0) + 1
            };
          }
          return req;
        });
        
        // Update the event with the new filled count
        await supabase
          .from('events')
          .update({ service_requests: updatedServiceRequests })
          .eq('id', event.id);
          
        console.log('Updated service request filled count for category:', applicationData.service_category);
      }
      
      // Refresh the page
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      console.error('Erro ao aprovar candidatura:', error);
      toast.error(error.message || 'Ocorreu um erro ao aprovar a candidatura');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting, 
    handleApproveApplication,
    handleRejectApplication
  };
};
