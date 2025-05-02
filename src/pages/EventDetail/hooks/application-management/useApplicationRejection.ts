import { useState } from 'react';
import { Event } from '@/types/events';
import { toast } from 'sonner';
import { sendProviderNotification } from '../useEventNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useRejectionState } from '../useEventStateBackup';

export const useApplicationRejection = (event: Event | null, onStatusUpdate?: (applicationId: string, status: 'accepted' | 'rejected') => void) => {
  const [rejecting, setRejecting] = useState(false);
  const [loadedEvent, setLoadedEvent] = useState<Event | null>(event);
  
  // Estado de rejeição local para garantir persistência mesmo sem banco de dados
  const { addRejectedApplication } = useRejectionState(event?.id);

  // Atualizar evento quando ele mudar externamente
  if (event && event !== loadedEvent) {
    setLoadedEvent(event);
  }

  /**
   * Rejects an application for an event by deleting it from the database
   * and saving the rejection information in a separate log table
   */
  const handleRejectApplication = async (applicationId: string, providerId: string, reason?: string): Promise<void> => {
    if (!applicationId) {
      console.error('ID da candidatura não fornecido');
      toast.error('Não foi possível recusar a candidatura: ID não fornecido');
      return;
    }
    
    if (!providerId) {
      console.error('ID do prestador não fornecido');
      toast.error('Não foi possível recusar a candidatura: ID do prestador não fornecido');
      return;
    }
    
    let eventData = loadedEvent;
    
    // Se não temos o evento, tentar buscá-lo a partir da candidatura
    if (!eventData) {
      console.log('Evento não encontrado, tentando buscar do banco de dados');
      try {
        const { data: applicationData, error } = await supabase
          .from('event_applications')
          .select('event_id')
          .eq('id', applicationId)
          .single();
        
        if (error || !applicationData) {
          console.error('Não foi possível encontrar a candidatura:', error);
          toast.error('Não foi possível recusar a candidatura: candidatura não encontrada');
          return;
        }
        
        const { data: eventInfo, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', applicationData.event_id)
          .single();
        
        if (eventError || !eventInfo) {
          console.error('Não foi possível encontrar o evento:', eventError);
          toast.error('Não foi possível recusar a candidatura: evento não encontrado');
          return;
        }
        
        eventData = eventInfo as Event;
        setLoadedEvent(eventData);
        console.log('Evento encontrado e carregado:', eventData.name);
      } catch (error: any) {
        console.error('Erro ao buscar dados do evento:', error);
        toast.error('Erro ao buscar dados do evento');
        return;
      }
    }
    
    if (!eventData) {
      console.error('Evento não encontrado mesmo após tentativa de busca');
      toast.error('Não foi possível recusar a candidatura: evento não encontrado');
      return;
    }
    
    if (rejecting) {
      console.log('Já existe uma operação de rejeição em andamento');
      return;
    }
    
    try {
      setRejecting(true);
      console.log('Iniciando rejeição (exclusão) da candidatura:', applicationId, 'para prestador:', providerId);
      
      // PASSO 0: Adicionar à lista de rejeitados local - isso garante que mesmo se as operações
      // do banco de dados falharem, a candidatura não aparecerá mais na interface
      addRejectedApplication(applicationId);
      console.log('Candidatura adicionada à lista de rejeitados local');
      
      // Primeiro: Salvar os dados da candidatura para histórico antes de excluí-la
      const { data: applicationData, error: fetchError } = await supabase
        .from('event_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
      
      if (fetchError) {
        console.error('Erro ao buscar dados da candidatura para histórico:', fetchError);
        // Continuar mesmo assim
      }
      
      // Segundo: Registrar a rejeição no log
      let logSuccess = false;
      try {
        console.log("Registrando dados da rejeição na tabela de log");
        
        // Criar tabela de log se não existir
        await supabase.rpc('ensure_rejection_log_table');
        
        const { error: logError } = await supabase
          .from('event_rejections')
          .insert({
            application_id: applicationId,
            provider_id: providerId,
            event_id: eventData.id,
            rejected_by: (await supabase.auth.getSession()).data.session?.user?.id,
            rejection_date: new Date().toISOString(),
            reason: reason || 'Sem justificativa fornecida',
            application_data: applicationData || undefined
          });
          
        if (logError) {
          console.warn('Erro ao registrar log de rejeição:', logError);
        } else {
          console.log('Log de rejeição registrado com sucesso');
          logSuccess = true;
        }
      } catch (logError) {
        console.warn('Exceção ao registrar log de rejeição:', logError);
        // Continuar mesmo com erro no log
      }
      
      // Terceiro: Deletar a candidatura
      let deleteSuccess = false;
      if (logSuccess) {
        try {
          console.log("Excluindo candidatura do banco de dados");
          const { error: deleteError } = await supabase
            .from('event_applications')
            .delete()
            .eq('id', applicationId);
          
          if (deleteError) {
            console.error('Erro ao excluir candidatura:', deleteError);
            // Tentar método alternativo
          } else {
            console.log('Candidatura excluída com sucesso');
            deleteSuccess = true;
          }
        } catch (deleteError) {
          console.error('Exceção ao excluir candidatura:', deleteError);
          // Tentar método alternativo
        }
      }
      
      // Método alternativo usando RPC se a exclusão direta falhar
      if (!deleteSuccess && logSuccess) {
        try {
          console.log("Tentando excluir candidatura via RPC");
          const { error: rpcError } = await supabase.rpc('delete_application', {
            app_id: applicationId
          });
          
          if (rpcError) {
            console.error('Erro ao excluir candidatura via RPC:', rpcError);
          } else {
            console.log('Candidatura excluída com sucesso via RPC');
            deleteSuccess = true;
          }
        } catch (rpcError) {
          console.error('Exceção ao excluir candidatura via RPC:', rpcError);
        }
      }
      
      // Enviar notificação ao prestador
      try {
        const notificationMessage = reason 
          ? `Sua candidatura para o evento "${eventData.name}" não foi aprovada. Motivo: ${reason}`
          : `Sua candidatura para o evento "${eventData.name}" não foi aprovada.`;
        
        await sendProviderNotification(
          eventData,
          providerId,
          "Candidatura rejeitada",
          notificationMessage,
          "application_rejected"
        );
        console.log('Notificação de rejeição enviada para o prestador');
      } catch (notifError) {
        console.error('Erro ao enviar notificação:', notifError);
        // Continuar mesmo se a notificação falhar
      }
      
      // Notificar o componente pai para atualização visual
      if (onStatusUpdate) {
        console.log('Notificando atualização de status para UI');
        onStatusUpdate(applicationId, 'rejected');
      }
      
      toast.success("Candidatura recusada com sucesso");
      
    } catch (error: any) {
      console.error('Erro geral ao rejeitar candidatura:', error);
      toast.error('Ocorreu um erro ao processar a recusa');
      throw error;
    } finally {
      console.log('Finalizando operação de rejeição');
      setRejecting(false);
    }
  };

  return {
    rejecting,
    handleRejectApplication
  };
};
