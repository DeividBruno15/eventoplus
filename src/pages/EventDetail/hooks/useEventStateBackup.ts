import { useCallback, useEffect } from 'react';

interface RejectionState {
  [eventId: string]: string[]; // ID do evento -> Lista de IDs de candidaturas rejeitadas
}

/**
 * Módulo para gerenciar candidaturas rejeitadas
 * Esta é uma camada extra de segurança para garantir que candidaturas rejeitadas não reapareçam
 */
export const useRejectionState = (eventId?: string) => {
  /**
   * Adiciona um ID de candidatura à lista de rejeitados
   */
  const addRejectedApplication = useCallback((applicationId: string) => {
    if (!eventId || !applicationId) return;
    
    try {
      // Carregar estado atual
      const currentRejectionState = localStorage.getItem('app_rejection_state') || '{}';
      const rejectionState: RejectionState = JSON.parse(currentRejectionState);
      
      // Adicionar ID à lista do evento
      if (!rejectionState[eventId]) {
        rejectionState[eventId] = [];
      }
      
      if (!rejectionState[eventId].includes(applicationId)) {
        rejectionState[eventId].push(applicationId);
        
        // Salvar estado atualizado
        localStorage.setItem('app_rejection_state', JSON.stringify(rejectionState));
        console.log(`[RejectionState] Candidatura ${applicationId} adicionada à lista de rejeitados para o evento ${eventId}`);
      }
    } catch (error) {
      console.error('[RejectionState] Erro ao adicionar candidatura rejeitada:', error);
    }
  }, [eventId]);
  
  /**
   * Verifica se uma candidatura foi rejeitada
   */
  const isApplicationRejected = useCallback((applicationId: string) => {
    if (!eventId || !applicationId) return false;
    
    try {
      // Carregar estado atual
      const currentRejectionState = localStorage.getItem('app_rejection_state') || '{}';
      const rejectionState: RejectionState = JSON.parse(currentRejectionState);
      
      // Verificar se o ID está na lista do evento
      return rejectionState[eventId]?.includes(applicationId) || false;
    } catch (error) {
      console.error('[RejectionState] Erro ao verificar candidatura rejeitada:', error);
      return false;
    }
  }, [eventId]);
  
  /**
   * Obtém todos os IDs rejeitados para o evento atual
   */
  const getRejectedIds = useCallback(() => {
    if (!eventId) return new Set<string>();
    
    try {
      // Carregar estado atual
      const currentRejectionState = localStorage.getItem('app_rejection_state') || '{}';
      const rejectionState: RejectionState = JSON.parse(currentRejectionState);
      
      // Retornar IDs do evento como um Set
      return new Set(rejectionState[eventId] || []);
    } catch (error) {
      console.error('[RejectionState] Erro ao obter candidaturas rejeitadas:', error);
      return new Set<string>();
    }
  }, [eventId]);
  
  /**
   * Filtra uma lista de candidaturas, removendo as rejeitadas
   */
  const filterRejectedApplications = useCallback((applications: any[]) => {
    const rejectedIds = getRejectedIds();
    if (rejectedIds.size === 0) return applications;
    
    return applications.filter(app => !rejectedIds.has(app.id));
  }, [getRejectedIds]);
  
  // Migrar do formato antigo para o novo, se necessário
  useEffect(() => {
    if (!eventId) return;
    
    try {
      // Verificar se há dados no formato antigo
      const oldFormatKey = `rejected_apps_${eventId}`;
      const oldData = localStorage.getItem(oldFormatKey);
      
      if (oldData) {
        console.log(`[RejectionState] Migrando dados do formato antigo para ${eventId}`);
        
        // Carregar IDs rejeitados do formato antigo
        const oldRejectedIds = JSON.parse(oldData);
        
        // Carregar estado atual no novo formato
        const currentRejectionState = localStorage.getItem('app_rejection_state') || '{}';
        const rejectionState: RejectionState = JSON.parse(currentRejectionState);
        
        // Adicionar IDs antigos ao novo formato
        if (!rejectionState[eventId]) {
          rejectionState[eventId] = [];
        }
        
        for (const id of oldRejectedIds) {
          if (!rejectionState[eventId].includes(id)) {
            rejectionState[eventId].push(id);
          }
        }
        
        // Salvar no novo formato
        localStorage.setItem('app_rejection_state', JSON.stringify(rejectionState));
        console.log(`[RejectionState] Migração concluída, ${oldRejectedIds.length} IDs migrados`);
      }
    } catch (error) {
      console.error('[RejectionState] Erro ao migrar dados:', error);
    }
  }, [eventId]);
  
  return {
    addRejectedApplication,
    isApplicationRejected,
    getRejectedIds,
    filterRejectedApplications
  };
}; 