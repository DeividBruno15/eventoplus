
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { sendProviderNotification } from '../useEventNotifications';
import { Event } from '@/types/events';

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

      // Create a conversation between provider and contractor if it doesn't exist
      // Use the newly created function to get or create a conversation
      const { data: conversationData, error: conversationError } = await supabase.rpc(
        // We need to use 'as any' here because TypeScript doesn't know about this function
        'create_or_get_conversation' as any, 
        { 
          user_id_one: contractorId,
          user_id_two: providerId
        }
      );

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw conversationError;
      }

      // The conversation ID is now directly returned as a UUID from our function
      const conversationId = conversationData;
        
      console.log('Created or got conversation:', conversationId);

      // 3. Send notification to provider
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
