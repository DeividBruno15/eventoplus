
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Exclui um evento pelo ID
 * @param eventId ID do evento a ser excluído
 * @returns Verdadeiro se a exclusão for bem-sucedida, falso caso contrário
 */
export const deleteEventById = async (eventId: string): Promise<boolean> => {
  try {
    console.log("Iniciando exclusão do evento com ID:", eventId);
    
    // Verificar a conexão com o Supabase antes de prosseguir
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.error("Sem conexão com o Supabase. Verifique a rede e as credenciais.");
      toast.error("Erro de conexão com o banco de dados. Verifique sua conexão com a internet.");
      return false;
    }
    
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
    toast.error(`Erro ao excluir evento: ${error.message || "Erro desconhecido"}`);
    return false;
  }
};

/**
 * Exclui o evento específico solicitado pelo ID
 * Esta função é para uso único para o caso específico solicitado
 */
export const deleteSpecificEvent = async (): Promise<void> => {
  try {
    console.log("Iniciando exclusão do evento específico");
    const eventId = '4705b1a9-8c99-4d5b-b62c-83bba2c3f9ab';
    
    // Verificar se o cliente Supabase está inicializado corretamente
    if (!supabase) {
      console.error("Cliente Supabase não inicializado");
      toast.error("Erro de conexão com o banco de dados");
      return;
    }
    
    // Verificar a conexão com o Supabase
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.error("Sem conexão com o Supabase");
      toast.error("Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.");
      return;
    }
    
    console.log("Cliente Supabase:", supabase);
    const result = await deleteEventById(eventId);
    
    if (result) {
      console.log(`Evento específico ${eventId} excluído com sucesso!`);
      toast.success(`Evento específico excluído com sucesso!`);
    } else {
      console.error(`Não foi possível excluir o evento específico ${eventId}`);
      toast.error(`Não foi possível excluir o evento específico`);
    }
  } catch (error: any) {
    console.error("Erro ao excluir evento específico:", error);
    toast.error(`Erro ao excluir evento específico: ${error.message || "Erro desconhecido"}`);
  }
};

/**
 * Simula a operação de exclusão para debug
 * Útil quando há problemas com CORS ou conexão
 */
export const simulateEventDeletion = async (eventId: string): Promise<void> => {
  try {
    console.log("Simulando exclusão do evento:", eventId);
    // Exibir informações sobre ambiente
    console.log("URL do Supabase:", supabase.supabaseUrl);
    console.log("Ambiente:", import.meta.env.MODE);
    
    // Simular exclusão bem-sucedida após 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Operação de simulação concluída. Em produção, o evento seria excluído.");
  } catch (error) {
    console.error("Erro na simulação:", error);
    toast.error("Falha na simulação");
  }
};
