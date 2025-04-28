
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Event, EventApplication } from '@/types/events';
import { useAuth } from '@/hooks/useAuth';

export const useEventApplications = (event: Event | null) => {
  const { toast } = useToast();
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
          provider_id: user.id, // Use the current user's ID instead of contractor_id
          message: message,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Candidatura enviada!",
        description: "O contratante foi notificado sobre seu interesse.",
      });

      await supabase
        .from('notifications')
        .insert({
          user_id: event.contractor_id,
          title: "Nova candidatura ao seu evento",
          content: `Você recebeu uma nova candidatura para o evento "${event.name}"`,
          type: "new_application",
          link: `/events/${event.id}`
        });
        
      // Refresh the page to see the application
      window.location.reload();
    } catch (error: any) {
      console.error('Erro ao enviar candidatura:', error);
      toast({
        title: "Erro ao enviar candidatura",
        description: error.message || 'Ocorreu um erro ao enviar sua candidatura',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveApplication = async (applicationId: string, providerId: string): Promise<void> => {
    if (!event) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);
        
      if (error) throw error;
      
      // Mark other applications as rejected for this service type
      await supabase
        .from('event_applications')
        .update({ status: 'rejected' })
        .eq('event_id', event.id)
        .neq('id', applicationId);
      
      await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', event.id);
      
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          service_request_id: null
        })
        .select()
        .single();
      
      if (conversationError) throw conversationError;
      
      await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: event.contractor_id },
          { conversation_id: conversation.id, user_id: providerId }
        ]);
      
      await supabase
        .from('notifications')
        .insert({
          user_id: providerId,
          title: "Parabéns! Você foi aprovado para um evento",
          content: `Sua candidatura para o evento "${event.name}" foi aprovada!`,
          type: "application_approved",
          link: `/events/${event.id}`
        });
      
      toast({
        title: "Candidatura aprovada!",
        description: "O prestador foi notificado e vocês já podem começar a conversar.",
      });
    } catch (error: any) {
      console.error('Erro ao aprovar candidatura:', error);
      toast({
        title: "Erro ao aprovar candidatura",
        description: error.message || 'Ocorreu um erro ao aprovar a candidatura',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    handleApply,
    handleApproveApplication
  };
};
