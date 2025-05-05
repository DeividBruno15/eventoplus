
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ApplicationApprovalConfig } from '../useApplicationApproval';

export const useApplicationApprovalHandler = (config: ApplicationApprovalConfig) => {
  const [approving, setApproving] = useState(false);
  const { toast } = useToast();
  const { eventId, onSuccess } = config;

  const handleApproveApplication = useCallback(async (applicationId: string, providerId: string) => {
    setApproving(true);

    try {
      // Update application status to accepted
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Candidatura aprovada!',
        description: 'Prestador de serviço foi notificado.'
      });

      if (onSuccess) {
        await onSuccess(applicationId, providerId);
      }
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao aprovar candidatura',
        description: error.message || 'Houve um problema ao aprovar esta candidatura.'
      });
    } finally {
      setApproving(false);
    }
  }, [eventId, toast, onSuccess]);

  return { 
    approving, 
    handleApproveApplication 
  };
};
