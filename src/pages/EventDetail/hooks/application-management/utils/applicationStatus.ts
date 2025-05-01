
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Updates the status of an application
 * @param applicationId ID of the application
 * @param status New status ('accepted' or 'rejected')
 */
export const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected'): Promise<any> => {
  console.log(`Atualizando application ${applicationId} para status: ${status}`);
  
  try {
    // First, check current status to ensure we're actually changing it
    const { data: currentApplication, error: fetchError } = await supabase
      .from('event_applications')
      .select('status')
      .eq('id', applicationId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching current application status:', fetchError);
      toast.error(`Erro ao verificar status atual: ${fetchError.message}`);
      throw fetchError;
    }
    
    // If status is already the requested status, log and return early
    if (currentApplication && currentApplication.status === status) {
      console.log(`Application ${applicationId} already has status ${status}, skipping update`);
      return currentApplication;
    }
    
    console.log(`Proceeding with update of application ${applicationId} from ${currentApplication?.status} to ${status}`);
    
    // Proceed with update since status is different - use upsert with returning: 'representation'
    // to ensure we get the complete updated record back
    const { data, error } = await supabase
      .from('event_applications')
      .update({ status })
      .eq('id', applicationId)
      .select('*')
      .limit(1);

    if (error) {
      console.error(`Error updating application to ${status}:`, error);
      toast.error(`Erro ao atualizar status da aplicação: ${error.message}`);
      throw error;
    }
    
    console.log(`Application ${applicationId} updated successfully to ${status}:`, data);
    
    // Check if we have valid data returned
    if (!data || data.length === 0) {
      console.warn(`No data returned after updating application ${applicationId}`);
      return null;
    }
    
    // Adicionar mais log para ajudar na depuração
    if (status === 'rejected') {
      console.log(`Provider for application ${applicationId} has been rejected and cannot apply again`);
    }
    
    // Return the updated application data
    return data[0];
  } catch (error: any) {
    console.error('Error in updateApplicationStatus:', error);
    toast.error(`Erro ao atualizar status: ${error.message}`);
    throw error;
  }
};
