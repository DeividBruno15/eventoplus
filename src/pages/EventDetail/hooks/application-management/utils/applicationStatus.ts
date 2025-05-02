
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Updates the status of an application
 * @param applicationId ID of the application
 * @param status New status ('accepted' or 'rejected')
 * @returns The updated application data
 * @throws Error if the update fails
 */
export const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
  try {
    console.log(`[DEBUG] Iniciando atualização: applicationId=${applicationId}, status=${status}`);
    
    // Primeiro, verificar se o registro existe
    console.log(`[DEBUG] Verificando se o registro existe: id=${applicationId}`);
    const { data: checkData, error: checkError } = await supabase
      .from('event_applications')
      .select('*')
      .eq('id', applicationId)
      .maybeSingle();

    if (checkError) {
      console.error(`[DEBUG] Erro ao verificar registro:`, checkError);
      throw checkError;
    }

    console.log(`[DEBUG] Resultado da verificação:`, checkData);
    if (!checkData) {
      console.warn(`[DEBUG] Nenhum registro encontrado com id=${applicationId}`);
    } else {
      console.log(`[DEBUG] Status atual: ${checkData.status}, novo status: ${status}`);
    }
    
    // Atualizar o status da aplicação na base de dados
    console.log(`[DEBUG] Executando update: id=${applicationId}, status=${status}`);
    const { data, error } = await supabase
      .from('event_applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .maybeSingle();

    if (error) {
      console.error(`[DEBUG] Erro ao atualizar para ${status}:`, error);
      throw error;
    }
    
    console.log(`[DEBUG] Resultado do update:`, data);
    
    // Se nenhum dado foi retornado mas não houve erro, construir uma resposta mínima
    const result = data ?? { id: applicationId, status };
    console.log(`[DEBUG] Retornando resultado final:`, result);
    
    // Retornar os dados atualizados
    return result;
  } catch (error: any) {
    console.error('[DEBUG] Erro em updateApplicationStatus:', error);
    throw error;
  }
}
