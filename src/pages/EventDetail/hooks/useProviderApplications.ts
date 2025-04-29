
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/events';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { sendApplicationNotification } from './useEventNotifications';

export const useProviderApplications = (event: Event | null) => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  /**
   * Handles the application submission for a provider
   */
  const handleApply = async (message: string, serviceCategory?: string): Promise<void> => {
    if (!event || !user) {
      toast.error("Erro de autenticação ou dados do evento inválidos.");
      return;
    }
    
    try {
      setSubmitting(true);
      console.log("Sending application with data:", { 
        event_id: event.id,
        provider_id: user.id,
        message,
        service_category: serviceCategory 
      });
      
      // Check if an application already exists
      const { data: existingApp, error: checkError } = await supabase
        .from('event_applications')
        .select('id')
        .eq('event_id', event.id)
        .eq('provider_id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116: No rows returned
        console.error('Error checking existing application:', checkError);
        throw new Error('Erro ao verificar candidaturas existentes');
      }
      
      if (existingApp) {
        toast.error("Você já possui uma candidatura para este evento.");
        return;
      }
      
      // Create the application data object
      const applicationData = {
        event_id: event.id,
        provider_id: user.id,
        message: message,
        status: 'pending',
        service_category: serviceCategory || null
      };
      
      // Log what we're trying to insert for debugging
      console.log('Attempting to insert application data:', applicationData);
      
      const { data, error } = await supabase
        .from('event_applications')
        .insert(applicationData)
        .select();
        
      if (error) {
        console.error('Application submission error:', error);
        throw error;
      }
      
      console.log('Application submitted successfully:', data);
      
      // Send notification to event owner
      try {
        await sendApplicationNotification(
          event,
          event.contractor_id,
          "Nova candidatura ao seu evento",
          `Você recebeu uma nova candidatura para o evento "${event.name}"`,
          "new_application"
        );
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
        // Don't throw here, application was successful
      }
      
      toast.success("Candidatura enviada com sucesso!");
      
      // Force a page reload to reflect the new state
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao enviar candidatura:', error);
      toast.error(error.message || "Erro ao enviar candidatura. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handles cancellation of an application by a provider
   */
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
      try {
        await sendApplicationNotification(
          event,
          event.contractor_id,
          "Candidatura cancelada",
          `Um prestador cancelou a candidatura para o evento "${event.name}"`,
          "application_cancelled"
        );
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
        // Don't throw here, cancellation was successful
      }
      
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

  return {
    submitting,
    handleApply,
    handleCancelApplication
  };
};
