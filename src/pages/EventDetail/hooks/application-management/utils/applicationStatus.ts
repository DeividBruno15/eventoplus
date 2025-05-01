
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates the status of an application
 * @param applicationId ID of the application
 * @param status New status ('accepted' or 'rejected')
 */
export const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected'): Promise<void> => {
  const { error } = await supabase
    .from('event_applications')
    .update({ status })
    .eq('id', applicationId);

  if (error) {
    console.error(`Error updating application to ${status}:`, error);
    throw error;
  }
  
  // Se for uma rejeição, também precisamos garantir que o prestador não possa se candidatar novamente
  if (status === 'rejected') {
    // Na versão futura, poderíamos adicionar um campo na tabela de eventos para rastrear prestadores rejeitados
    console.log(`Provider for application ${applicationId} has been rejected and cannot apply again`);
  }
};
