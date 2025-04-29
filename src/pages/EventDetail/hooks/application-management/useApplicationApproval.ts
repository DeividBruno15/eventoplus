
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/events';
import { createConversation } from '@/services/conversations';

export const useApplicationApproval = (event: Event | null, updateStatus?: (id: string) => void) => {
  const [approving, setApproving] = useState(false);

  const handleApproveApplication = async (applicationId: string, providerId: string) => {
    if (!event) {
      toast.error("Dados do evento não disponíveis");
      return;
    }

    try {
      setApproving(true);
      
      // Update application status in database
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      // Create or get conversation between contractor and provider
      const { error: convError, data: conversation } = await supabase.rpc(
        'get_or_create_conversation',
        { 
          user1_id: event.contractor_id, 
          user2_id: providerId 
        }
      );
      
      if (convError) throw convError;
      
      // Notify user of successful approval
      toast.success("Aplicação aprovada com sucesso!");
      
      // Update local state if callback provided
      if (updateStatus) {
        updateStatus(applicationId);
      }
      
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast.error(`Erro ao aprovar aplicação: ${error.message}`);
    } finally {
      setApproving(false);
    }
  };

  return {
    approving,
    handleApproveApplication
  };
};
