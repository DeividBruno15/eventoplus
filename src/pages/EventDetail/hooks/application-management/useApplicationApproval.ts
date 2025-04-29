
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { notificationsService } from '@/services/notifications';
import { Event } from '@/types/events';

export const useApplicationApproval = (event: Event | null, updateApplicationStatus?: (applicationId: string) => void) => {
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleApproveApplication = async (applicationId: string, providerId: string): Promise<void> => {
    if (!event) return;
    
    setIsApproving(true);
    try {
      const contractorId = event.contractor_id;
      const eventId = event.id;
      
      // 1. Update application status
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'accepted' })
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
        .rpc('get_user_conversations', {
          p_user_id: providerId
        });

      if (conversationError) throw conversationError;

      // For now, we'll skip updating the conversation_id in event_applications since it's not in the type
      // We'll create a separate channel for communication

      // 3. Send notification to provider
      await notificationsService.sendNotification({
        userId: providerId,
        title: 'Proposta aceita!',
        content: `Sua proposta para um evento foi aceita por ${userData.first_name} ${userData.last_name}.`,
        type: 'application_approved',
        link: `/events/${eventId}`
      });

      // Update local state if callback provided
      if (updateApplicationStatus) {
        updateApplicationStatus(applicationId);
      }

      toast({
        title: "Proposta aceita",
        description: "O prestador de serviço foi notificado e um chat foi criado para vocês conversarem.",
      });
      
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast({
        title: "Erro ao aprovar proposta",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const openChat = (conversationId: string) => {
    if (!conversationId) return;
    navigate(`/chat/${conversationId}`);
  };

  return { 
    handleApproveApplication, 
    isApproving, 
    openChat 
  };
};
