
import { useState } from 'react';
import { Event, EventApplication } from '@/types/events';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { sendApplicationNotification } from './useEventNotifications';

export const useProviderApplications = (event: Event | null) => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleApply = async (message: string, serviceCategory?: string): Promise<void> => {
    if (!event || !user) {
      toast.error('Você precisa estar logado para se candidatar');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const application = {
        provider_id: user.id,
        event_id: event.id,
        message,
        service_category: serviceCategory || event.service_type || 'Não especificado'
      };
      
      const { error } = await supabase
        .from('event_applications')
        .insert([application]);
      
      if (error) throw error;
      
      toast.success('Candidatura enviada com sucesso!');
      
      // Notificar o contratante que recebeu uma nova candidatura
      try {
        // Buscar dados do prestador para incluir no texto da notificação
        const { data: providerData } = await supabase
          .from('user_profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        
        const providerName = providerData ? `${providerData.first_name} ${providerData.last_name}` : 'Um prestador';
        
        await sendApplicationNotification(
          event,
          event.contractor_id,
          "Nova candidatura recebida",
          `${providerName} se candidatou para o evento "${event.name}".`,
          "new_application"
        );
        console.log('Notificação de candidatura enviada para o contratante:', event.contractor_id);
      } catch (notificationError) {
        console.error('Erro ao enviar notificação de candidatura:', notificationError);
      }
      
    } catch (error: any) {
      console.error('Erro ao enviar candidatura:', error);
      toast.error(error.message || 'Ocorreu um erro ao enviar sua candidatura');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancelApplication = async (applicationId: string): Promise<void> => {
    if (!user) return;
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('event_applications')
        .delete()
        .eq('id', applicationId)
        .eq('provider_id', user.id);
      
      if (error) throw error;
      
      toast.success('Candidatura cancelada com sucesso!');
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
