
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
    if (!event || !user) return;
    
    try {
      setSubmitting(true);
      
      // Create the application data object
      const applicationData: any = {
        event_id: event.id,
        provider_id: user.id,
        message: message,
        status: 'pending'
      };
      
      // Only add service_category if it exists in the schema
      if (serviceCategory) {
        applicationData.service_category = serviceCategory;
      }
      
      const { data, error } = await supabase
        .from('event_applications')
        .insert(applicationData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Send notification to event owner
      await sendApplicationNotification(
        event,
        event.contractor_id,
        "Nova candidatura ao seu evento",
        `Você recebeu uma nova candidatura para o evento "${event.name}"`,
        "new_application"
      );
      
      toast.success("Candidatura enviada com sucesso!");
      
    } catch (error: any) {
      console.error('Erro ao enviar candidatura:', error);
      toast.error("Erro ao enviar candidatura. Tente novamente.");
      throw error;
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
      await sendApplicationNotification(
        event,
        event.contractor_id,
        "Candidatura cancelada",
        `Um prestador cancelou a candidatura para o evento "${event.name}"`,
        "application_cancelled"
      );
      
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
