
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/events';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { sendApplicationNotification } from './useEventNotifications';

export const useProviderApplications = (event: Event | null) => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  /**
   * Apply to an event as a provider
   */
  const handleApply = async (message: string, serviceCategory?: string): Promise<void> => {
    if (!event || !user) {
      toast.error('Você precisa estar logado para se candidatar');
      return;
    }

    try {
      setSubmitting(true);
      
      // Check if user has already been rejected for this event
      const { data: existingApplications, error: checkError } = await supabase
        .from('event_applications')
        .select('status')
        .eq('event_id', event.id)
        .eq('provider_id', user.id);
      
      if (checkError) {
        console.error('Error checking existing applications:', checkError);
        toast.error('Erro ao verificar candidaturas existentes');
        return;
      }
      
      const rejectedApplication = existingApplications?.find(app => app.status === 'rejected');
      if (rejectedApplication) {
        toast.error('Sua candidatura para este evento já foi rejeitada anteriormente.');
        return;
      }
      
      // Insert new application
      const { data, error } = await supabase
        .from('event_applications')
        .insert({
          event_id: event.id,
          provider_id: user.id,
          message,
          service_category: serviceCategory || 'General'
        })
        .select('*')
        .single();
        
      if (error) {
        console.error('Error applying to event:', error);
        toast.error('Ocorreu um erro ao enviar sua candidatura');
        return;
      }
      
      console.log('New application created:', data);
      
      // Obter informações do prestador para incluir na notificação
      const { data: providerData } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
      
      const providerName = providerData ? 
        `${providerData.first_name} ${providerData.last_name}` : 
        'Um prestador';
      
      // Correção: Enviar notificação para o contractor_id do evento em vez de user_id
      try {
        await sendApplicationNotification(
          event,
          event.contractor_id,
          "Nova candidatura recebida",
          `${providerName} se candidatou ao seu evento "${event.name}".`,
          "new_application"
        );
        console.log('Application notification sent to contractor:', event.contractor_id);
      } catch (notificationError) {
        console.error('Error sending application notification:', notificationError);
      }
      
      toast.success('Candidatura enviada com sucesso!');
    } catch (error: any) {
      console.error('Error in handleApply:', error);
      toast.error(error.message || 'Ocorreu um erro ao enviar sua candidatura');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Cancel an application
   */
  const handleCancelApplication = async (applicationId: string): Promise<void> => {
    if (!user) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('event_applications')
        .delete()
        .eq('id', applicationId)
        .eq('provider_id', user.id);
        
      if (error) {
        console.error('Error cancelling application:', error);
        toast.error('Erro ao cancelar candidatura');
        return;
      }
      
      toast.success('Candidatura cancelada com sucesso!');
    } catch (error: any) {
      console.error('Error in handleCancelApplication:', error);
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
