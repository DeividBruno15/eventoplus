
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Event, EventApplication } from '@/types/events';
import { useAuth } from '@/hooks/useAuth';
import { notificationsService } from '@/services/notifications';
import { toast } from 'sonner';

export const useEventApplications = (event: Event | null) => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleApply = async (message: string): Promise<void> => {
    if (!event || !user) return;
    
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('event_applications')
        .insert({
          event_id: event.id,
          provider_id: user.id,
          message: message,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Send notification to event owner
      await notificationsService.sendNotification({
        userId: event.contractor_id,
        title: "Nova candidatura ao seu evento",
        content: `Você recebeu uma nova candidatura para o evento "${event.name}"`,
        type: "new_application",
        link: `/events/${event.id}`
      });
        
      // Refresh the page to see the application
      window.location.reload();
    } catch (error: any) {
      console.error('Erro ao enviar candidatura:', error);
      toast.error(error.message || 'Ocorreu um erro ao enviar sua candidatura');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelApplication = async (applicationId: string): Promise<void> => {
    if (!event || !user) return;
    
    try {
      setSubmitting(true);
      
      // Delete the application
      const { error } = await supabase
        .from('event_applications')
        .delete()
        .eq('id', applicationId)
        .eq('provider_id', user.id); // Ensure the user owns this application
        
      if (error) throw error;
      
      // Notify the contractor
      await notificationsService.sendNotification({
        userId: event.contractor_id,
        title: "Candidatura cancelada",
        content: `Um prestador cancelou a candidatura para o evento "${event.name}"`,
        type: "application_cancelled",
        link: `/events/${event.id}`
      });
      
      toast.success("Candidatura cancelada com sucesso!");
      
      // Refresh the page
      window.location.reload();
    } catch (error: any) {
      console.error('Erro ao cancelar candidatura:', error);
      toast.error(error.message || 'Ocorreu um erro ao cancelar sua candidatura');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveApplication = async (applicationId: string, providerId: string): Promise<void> => {
    if (!event) return;
    
    try {
      setSubmitting(true);
      
      // Get the application to determine which service it's for
      const { data: applicationData, error: appError } = await supabase
        .from('event_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
        
      if (appError) throw appError;
      
      // Approve this application
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);
        
      if (error) throw error;
      
      // Mark other applications as rejected for this service type
      await supabase
        .from('event_applications')
        .update({ status: 'rejected' })
        .eq('event_id', event.id)
        .neq('id', applicationId);
      
      // Update event status to published if it's not already
      await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', event.id);
      
      // Create a conversation for them to chat
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          service_request_id: null
        })
        .select()
        .single();
      
      if (conversationError) throw conversationError;
      
      // Add both participants to the conversation
      await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: event.contractor_id },
          { conversation_id: conversation.id, user_id: providerId }
        ]);
      
      // Send notification to provider
      await notificationsService.sendNotification({
        userId: providerId,
        title: "Parabéns! Você foi aprovado para um evento",
        content: `Sua candidatura para o evento "${event.name}" foi aprovada!`,
        type: "application_approved",
        link: `/events/${event.id}`
      });
      
      toast.success("Candidatura aprovada! Você e o prestador já podem conversar.");
      
      // Increment the filled count for this service in service_requests
      if (event.service_requests && event.service_requests.length > 0) {
        // Get current service_requests
        const updatedServiceRequests = [...event.service_requests].map(req => {
          return {
            ...req,
            filled: (req.filled || 0) + 1
          };
        });
        
        // Update the event with the new filled count
        await supabase
          .from('events')
          .update({ service_requests: updatedServiceRequests })
          .eq('id', event.id);
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
    handleApply,
    handleApproveApplication,
    handleCancelApplication
  };
};
