
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Event } from '@/types/events';
import { sendProviderNotification } from '../useEventNotifications';
import { createOrGetConversation } from './utils/conversation';
import { updateApplicationStatus } from './utils/applicationStatus';
import { supabase } from '@/integrations/supabase/client';

export const useApplicationApproval = (event: Event | null, updateApplicationStatus?: (applicationId: string) => void) => {
  const [isApproving, setIsApproving] = useState(false);
  const navigate = useNavigate();

  const handleApproveApplication = async (applicationId: string, providerId: string): Promise<void> => {
    if (!event) return;
    
    setIsApproving(true);
    try {
      const contractorId = event.contractor_id;
      const eventId = event.id;
      
      // 1. Update application status
      await updateApplicationStatus(applicationId, 'accepted');

      // 2. Get contractor name for the notification
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', contractorId)
        .single();

      if (userError) throw userError;

      // 3. Create or get conversation between provider and contractor
      const conversationId = await createOrGetConversation(contractorId, providerId);
      console.log('Created or got conversation:', conversationId);

      // 4. Send notification to provider
      await sendProviderNotification(
        event,
        providerId,
        'Proposta aceita!',
        `Sua proposta para o evento "${event.name}" foi aceita.`,
        'application_approved'
      );

      // Update local state if callback provided
      if (updateApplicationStatus) {
        updateApplicationStatus(applicationId);
      }

      toast.success("Candidatura aprovada com sucesso.");
      
      // Open chat with the provider
      if (conversationId) {
        navigate(`/chat/${conversationId}`);
      }
      
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast.error(error.message || 'Ocorreu um erro ao aprovar a candidatura');
    } finally {
      setIsApproving(false);
    }
  };

  return { 
    handleApproveApplication, 
    isApproving
  };
};
