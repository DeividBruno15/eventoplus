import { useState, useEffect, useCallback } from 'react';
import { EventApplication, EventStatus } from '@/types/events';
import { toast } from 'sonner';

export const useApplicationsList = (initialApplications: EventApplication[]) => {
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [localApplications, setLocalApplications] = useState<EventApplication[]>(initialApplications);
  
  // Update local applications whenever the props change
  useEffect(() => {
    console.log('Applications list updated from props:', initialApplications.length);
    
    // Verificar se há diferenças significativas antes de atualizar
    const needsUpdate = hasSignificantChanges(initialApplications, localApplications);
    
    if (needsUpdate) {
      console.log('Detected significant changes in applications, updating local state');
      setLocalApplications(initialApplications);
    }
  }, [initialApplications, localApplications]);
  
  // Função para verificar se existem mudanças significativas entre as listas
  const hasSignificantChanges = (newApps: EventApplication[], currentApps: EventApplication[]) => {
    // Se o número de itens é diferente, há mudanças significativas
    if (newApps.length !== currentApps.length) {
      return true;
    }
    
    // Mapear IDs atuais para facilitar a busca
    const currentIdsMap = new Map(currentApps.map(app => [app.id, app]));
    
    // Verificar se há novos IDs ou se algum status mudou
    for (const app of newApps) {
      const currentApp = currentIdsMap.get(app.id);
      
      // Se um item não existe na lista atual ou seu status mudou
      if (!currentApp || currentApp.status !== app.status) {
        return true;
      }
    }
    
    return false;
  };
  
  // Função para verificar se uma operação já está em andamento
  const isApplicationBeingProcessed = useCallback((applicationId: string) => {
    return processingIds.includes(applicationId);
  }, [processingIds]);
  
  // Função para validar IDs antes da operação
  const validateIds = useCallback((applicationId: string, providerId: string) => {
    if (!applicationId) {
      console.error('useApplicationsList: ID da candidatura não fornecido');
      throw new Error('ID da candidatura não fornecido');
    }
    
    if (!providerId) {
      console.error('useApplicationsList: ID do prestador não fornecido');
      throw new Error('ID do prestador não fornecido');
    }
    
    return true;
  }, []);
  
  const handleApprove = async (
    applicationId: string, 
    providerId: string,
    onApprove: (applicationId: string, providerId: string) => Promise<void>
  ) => {
    try {
      // Validar IDs e verificar se operação já está em andamento
      validateIds(applicationId, providerId);
      
      if (isApplicationBeingProcessed(applicationId)) {
        console.log(`useApplicationsList: Operação já em andamento para a candidatura ${applicationId}`);
        return;
      }
      
      console.log(`useApplicationsList: Iniciando aprovação da candidatura ${applicationId}`);
      
      // Adicionar à lista de IDs em processamento
      setProcessingIds(prev => [...prev, applicationId]);
      
      // Executar a função de aprovação
      await onApprove(applicationId, providerId);
      
      // Atualizar estado local após sucesso
      setLocalApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: 'accepted' } : app
        )
      );
      console.log(`useApplicationsList: Candidatura ${applicationId} marcada como aceita no estado local`);
    } catch (error: any) {
      console.error(`useApplicationsList: Erro ao aprovar candidatura ${applicationId}:`, error);
      // Propagamos o erro para tratamento pelo componente pai
      throw error;
    } finally {
      // Remover da lista de IDs em processamento
      setProcessingIds(prev => prev.filter(id => id !== applicationId));
    }
  };
  
  const handleReject = async (
    applicationId: string, 
    providerId: string,
    onReject: (applicationId: string, providerId: string) => Promise<void>
  ) => {
    try {
      // Validar IDs e verificar se operação já está em andamento
      validateIds(applicationId, providerId);
      
      if (isApplicationBeingProcessed(applicationId)) {
        console.log(`useApplicationsList: Operação já em andamento para a candidatura ${applicationId}`);
        return;
      }
      
      console.log(`useApplicationsList: Iniciando rejeição da candidatura ${applicationId}`);
      
      // Adicionar à lista de IDs em processamento
      setProcessingIds(prev => [...prev, applicationId]);
      
      // Executar a função de rejeição
      await onReject(applicationId, providerId);
      
      // Atualizar estado local após sucesso
      setLocalApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: 'rejected' } : app
        )
      );
      console.log(`useApplicationsList: Candidatura ${applicationId} marcada como rejeitada no estado local`);
    } catch (error: any) {
      console.error(`useApplicationsList: Erro ao rejeitar candidatura ${applicationId}:`, error);
      // Propagamos o erro para tratamento pelo componente pai
      throw error;
    } finally {
      // Remover da lista de IDs em processamento
      setProcessingIds(prev => prev.filter(id => id !== applicationId));
    }
  };
  
  const isButtonDisabled = (applicationId: string, submitting: boolean, eventStatus: string) => {
    return submitting || isApplicationBeingProcessed(applicationId) || eventStatus === 'closed';
  };

  return {
    localApplications,
    processingIds,
    handleApprove,
    handleReject,
    isButtonDisabled
  };
};
