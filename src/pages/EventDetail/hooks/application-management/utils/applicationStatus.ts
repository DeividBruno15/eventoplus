
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Updates the status of an application
 * @param applicationId ID of the application
 * @param status New status ('accepted' or 'rejected')
 */
export const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected'): Promise<void> => {
  console.log(`Updating application ${applicationId} to status: ${status}`);
  
  try {
    // Incluir .select() para retornar os dados atualizados
    const { data, error } = await supabase
      .from('event_applications')
      .update({ status })
      .eq('id', applicationId)
      .select();

    if (error) {
      console.error(`Error updating application to ${status}:`, error);
      toast.error(`Erro ao atualizar status da aplicação: ${error.message}`);
      throw error;
    }
    
    console.log(`Application ${applicationId} updated successfully to ${status}`, data);
    
    // Adicionar mais log para ajudar na depuração
    if (status === 'rejected') {
      console.log(`Provider for application ${applicationId} has been rejected and cannot apply again`);
    }
  } catch (error: any) {
    console.error('Error in updateApplicationStatus:', error);
    toast.error(`Erro ao atualizar status: ${error.message}`);
    throw error;
  }
};
