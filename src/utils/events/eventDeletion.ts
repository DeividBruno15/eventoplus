
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Exclui um evento pelo ID
 * @param eventId ID do evento a ser excluído
 * @returns Verdadeiro se a exclusão for bem-sucedida, falso caso contrário
 */
export const deleteEventById = async (eventId: string): Promise<boolean> => {
  try {
    console.log("Iniciando exclusão do evento com ID:", eventId);
    
    // Primeiro excluímos todas as candidaturas relacionadas a este evento
    const { error: applicationsError } = await supabase
      .from('event_applications')
      .delete()
      .eq('event_id', eventId);
      
    if (applicationsError) {
      console.error("Erro ao excluir candidaturas do evento:", applicationsError);
      toast.error(`Erro ao excluir candidaturas: ${applicationsError.message}`);
      return false;
    }
    
    console.log("Candidaturas excluídas com sucesso, excluindo evento");
    
    // Em seguida, excluímos o evento em si
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
      
    if (error) {
      console.error("Erro ao excluir evento:", error);
      toast.error(`Erro ao excluir evento: ${error.message}`);
      return false;
    }
    
    console.log("Evento excluído com sucesso!");
    toast.success("Evento excluído com sucesso");
    return true;
    
  } catch (error: any) {
    console.error("Erro durante a exclusão do evento:", error);
    toast.error(`Erro ao excluir evento: ${error.message}`);
    return false;
  }
};

/**
 * Exclui o evento específico solicitado pelo ID
 * Esta função é para uso único para o caso específico solicitado
 */
export const deleteSpecificEvent = async (): Promise<void> => {
  const eventId = '4705b1a9-8c99-4d5b-b62c-83bba2c3f9ab';
  const result = await deleteEventById(eventId);
  
  if (result) {
    toast.success(`Evento específico ${eventId} excluído com sucesso!`);
  } else {
    toast.error(`Não foi possível excluir o evento específico ${eventId}`);
  }
};
