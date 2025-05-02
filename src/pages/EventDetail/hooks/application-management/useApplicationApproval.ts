import { useState } from 'react';
import { Event } from '@/types/events';
import { toast } from 'sonner';
import { sendProviderNotification } from '../useEventNotifications';
import { updateApplicationStatus } from './utils/applicationStatus';
import { supabase } from '@/integrations/supabase/client';

export const useApplicationApproval = (event: Event | null, onStatusUpdate?: (applicationId: string, status: 'accepted' | 'rejected') => void) => {
  const [approving, setApproving] = useState(false);
  const [loadedEvent, setLoadedEvent] = useState<Event | null>(event);

  // Atualizar evento quando ele mudar externamente
  if (event && event !== loadedEvent) {
    setLoadedEvent(event);
  }

  /**
   * Approves an application for an event
   */
  const handleApproveApplication = async (applicationId: string, providerId: string): Promise<void> => {
    if (!applicationId) {
      console.error('ID da candidatura não fornecido');
      toast.error('Não foi possível aprovar a candidatura: ID não fornecido');
      return;
    }
    
    if (!providerId) {
      console.error('ID do prestador não fornecido');
      toast.error('Não foi possível aprovar a candidatura: ID do prestador não fornecido');
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
          toast.error('Não foi possível aprovar a candidatura: candidatura não encontrada');
          return;
        }
        
        const { data: eventInfo, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', applicationData.event_id)
          .single();
        
        if (eventError || !eventInfo) {
          console.error('Não foi possível encontrar o evento:', eventError);
          toast.error('Não foi possível aprovar a candidatura: evento não encontrado');
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
      toast.error('Não foi possível aprovar a candidatura: evento não encontrado');
      return;
    }
    
    if (approving) {
      console.log('Já existe uma operação de aprovação em andamento');
      return;
    }
    
    try {
      setApproving(true);
      console.log('Iniciando aprovação de candidatura:', applicationId, 'para prestador:', providerId);
      
      try {
        const updatedApplication = await updateApplicationStatus(applicationId, 'accepted');
        console.log('Status atualizado com sucesso:', updatedApplication);
        
        // Atualizar estado local
        if (onStatusUpdate) {
          console.log('Notificando callback de atualização');
          onStatusUpdate(applicationId, 'accepted');
        }
        
        // Enviar notificação ao prestador
        try {
          await sendProviderNotification(
            eventData,
            providerId,
            "Candidatura aprovada",
            `Parabéns! Sua candidatura para o evento "${eventData.name}" foi aprovada.`,
            "application_accepted"
          );
          console.log('Notificação enviada ao prestador');
        } catch (notificationError: any) {
          console.error('Erro ao enviar notificação:', notificationError);
          // Não impedimos o fluxo se a notificação falhar
        }
        
        toast.success("Candidatura aprovada com sucesso");
      } catch (error: any) {
        console.error('Erro ao aprovar candidatura:', error);
        
        let errorMessage = 'Erro ao aprovar candidatura';
        if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        throw error;
      }
    } catch (error: any) {
      console.error('Erro geral ao aprovar candidatura:', error);
      toast.error('Ocorreu um erro ao aprovar a candidatura');
      throw error;
    } finally {
      console.log('Finalizando operação de aprovação');
      setApproving(false);
    }
  };

  return {
    approving,
    handleApproveApplication
  };
};
