
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Event, EventApplication } from '@/types/events';
import { sendNewApplicationNotification } from './useEventNotifications';

export const useProviderApplications = (event: Event | null) => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Handle applying to an event
  const handleApply = useCallback(async (message: string, serviceCategory?: string) => {
    if (!user || !event) {
      toast({
        variant: 'destructive',
        title: 'Erro ao candidatar-se',
        description: 'Você precisa estar logado e ter um evento válido.'
      });
      return;
    }
    
    console.log(`Provider ${user.id} applying to event ${event.id} with service ${serviceCategory}`);
    setSubmitting(true);
    
    try {
      // Get provider's profile name for the notification
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error getting user profile:', profileError);
        throw new Error('Erro ao obter informações do perfil');
      }
      
      // Create the application
      const { data, error } = await supabase
        .from('event_applications')
        .insert({
          event_id: event.id,
          provider_id: user.id,
          message,
          service_category: serviceCategory || event.service_type,
          status: 'pending'
        })
        .select();
        
      if (error) {
        console.error('Error creating application:', error);
        throw new Error('Erro ao criar candidatura');
      }
      
      console.log('Application created successfully:', data);
      
      // Send notification to event contractor
      const providerName = `${profileData.first_name} ${profileData.last_name || ''}`.trim();
      const notificationSent = await sendNewApplicationNotification(event, providerName);
      
      if (!notificationSent) {
        console.warn('Application created but notification failed to send to contractor');
      }
      
      toast({
        title: 'Candidatura enviada com sucesso!',
        description: 'O contratante foi notificado da sua candidatura.'
      });
      
    } catch (error: any) {
      console.error('Error in handleApply:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao candidatar-se',
        description: error.message || 'Ocorreu um erro ao enviar sua candidatura.'
      });
    } finally {
      setSubmitting(false);
    }
  }, [user, event, toast]);
  
  // Handle canceling an application
  const handleCancelApplication = useCallback(async (applicationId: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro ao cancelar candidatura',
        description: 'Você precisa estar logado.'
      });
      return;
    }
    
    console.log(`Canceling application ${applicationId}`);
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('event_applications')
        .delete()
        .eq('id', applicationId)
        .eq('provider_id', user.id);
        
      if (error) {
        console.error('Error canceling application:', error);
        throw new Error('Erro ao cancelar candidatura');
      }
      
      console.log('Application canceled successfully');
      toast({
        title: 'Candidatura cancelada',
        description: 'Sua candidatura foi cancelada com sucesso.'
      });
      
    } catch (error: any) {
      console.error('Error in handleCancelApplication:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao cancelar candidatura',
        description: error.message || 'Ocorreu um erro ao cancelar sua candidatura.'
      });
    } finally {
      setSubmitting(false);
    }
  }, [user, toast]);
  
  return {
    submitting,
    handleApply,
    handleCancelApplication
  };
};
