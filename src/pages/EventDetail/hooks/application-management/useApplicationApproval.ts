
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { notificationsService } from '@/services/notifications';

export const useApplicationApproval = () => {
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const approve = async (applicationId: string, providerId: string, contractorId: string, eventId: string) => {
    setIsApproving(true);
    try {
      // 1. Update application status
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);

      if (error) throw error;

      // 2. Create or get conversation
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', contractorId)
        .single();

      if (userError) throw userError;

      // Create a conversation between provider and contractor
      const { data: conversationData, error: conversationError } = await supabase
        .rpc('create_conversation', {
          user_id_one: providerId,
          user_id_two: contractorId
        });

      if (conversationError) throw conversationError;

      const conversationId = conversationData;

      // 3. Update event application with conversation_id
      const { error: updateError } = await supabase
        .from('event_applications')
        .update({ conversation_id: conversationId })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // 4. Send notification to provider
      await notificationsService.sendNotification({
        userId: providerId,
        title: 'Proposta aceita!',
        content: `Sua proposta para um evento foi aceita por ${userData.first_name} ${userData.last_name}.`,
        type: 'application_approved',
        link: `/events/${eventId}`
      });

      toast({
        title: "Proposta aceita",
        description: "O prestador de serviço foi notificado e um chat foi criado para vocês conversarem.",
      });

      return { success: true, conversationId };
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast({
        title: "Erro ao aprovar proposta",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, conversationId: null };
    } finally {
      setIsApproving(false);
    }
  };

  const openChat = (conversationId: string) => {
    if (!conversationId) return;
    navigate(`/chat/${conversationId}`);
  };

  return { approve, isApproving, openChat };
};
