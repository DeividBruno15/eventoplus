import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventApplication, EventStatus } from '@/types/events';
import { ApplicationCard } from './ApplicationCard';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Event } from '@/types/events';
import { useApplicationRejection } from '../../hooks/application-management/useApplicationRejection';
import { useApplicationApproval } from '../../hooks/application-management/useApplicationApproval';

interface ApplicationsListProps {
  event: Event | null;
  applications: EventApplication[];
  isLoading: boolean;
  onApplicationStatusChange?: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

export const ApplicationsList = ({ 
  event,
  applications = [],
  isLoading,
  onApplicationStatusChange
}: ApplicationsListProps) => {
  // Log de depuração para ajudar a rastrear problemas
  console.log('ApplicationsList renderizando:', { 
    eventoNulo: event === null, 
    eventoId: event?.id || 'N/A',
    eventoNome: event?.name || 'N/A',
    quantidadeCandidaturas: applications.length
  });

  // Estado local para aplicações (para permitir remover após rejeição)
  const [localApplications, setLocalApplications] = useState<EventApplication[]>([]);
  
  // Mapear IDs de candidaturas que foram rejeitadas localmente
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  
  // Função de atualização de status local
  const onStatusUpdate = useCallback((applicationId: string, status: 'accepted' | 'rejected') => {
    console.log(`ApplicationsList: Atualizando status de aplicação ${applicationId} para ${status}`);
    
    if (status === 'rejected') {
      // Adicionar ID à lista de rejeitados
      setRejectedIds(prevIds => {
        const newIds = new Set(prevIds);
        newIds.add(applicationId);
        return newIds;
      });
      
      // Remover da lista local imediatamente
      setLocalApplications(prev => prev.filter(app => app.id !== applicationId));
    } else {
      // Atualizar status para outras alterações
      setLocalApplications(prev => 
        prev.map(app => app.id === applicationId ? { ...app, status } : app)
      );
    }
    
    // Notificar o componente pai para atualização global
    if (onApplicationStatusChange) {
      console.log(`ApplicationsList: Notificando callback externo para ${applicationId}`);
      onApplicationStatusChange(applicationId, status);
    }
  }, [onApplicationStatusChange]);
  
  // Resetar quando aplicações externas mudarem, mas preservando rejeições locais
  useEffect(() => {
    console.log('ApplicationsList: Atualizando aplicações locais', applications.length);
    
    // Filtra candidaturas já rejeitadas localmente
    const filteredApplications = applications.filter(app => !rejectedIds.has(app.id));
    setLocalApplications(filteredApplications);
    
  }, [applications, rejectedIds]);
  
  // Hooks para aprovação e rejeição
  const { rejecting, handleRejectApplication } = useApplicationRejection(event, onStatusUpdate);
  const { approving, handleApproveApplication } = useApplicationApproval(event, onStatusUpdate);
  
  // Desabilitar botões quando uma operação está em andamento
  const isProcessing = rejecting || approving;
  
  // Função para manusear a rejeição - agora removerá da lista
  const handleReject = async (applicationId: string, providerId: string, reason?: string) => {
    try {
      console.log(`ApplicationsList: Iniciando rejeição de candidatura ${applicationId}`);
      
      // Adicionar ID à lista de rejeitados imediatamente para feedback visual
      setRejectedIds(prevIds => {
        const newIds = new Set(prevIds);
        newIds.add(applicationId);
        return newIds;
      });
      
      // Remover da lista local imediatamente para feedback visual
      setLocalApplications(prev => prev.filter(app => app.id !== applicationId));
      
      // Processar a rejeição no backend
      await handleRejectApplication(applicationId, providerId, reason);
      
      console.log(`ApplicationsList: Candidatura ${applicationId} rejeitada e removida com sucesso`);
    } catch (error: any) {
      console.error(`ApplicationsList: Erro ao rejeitar candidatura ${applicationId}:`, error);
      
      // Em caso de erro, remover da lista de rejeitados e restaurar na lista visual
      setRejectedIds(prevIds => {
        const newIds = new Set(prevIds);
        newIds.delete(applicationId);
        return newIds;
      });
      
      // Encontrar a candidatura original para restaurá-la
      const originalApplication = applications.find(app => app.id === applicationId);
      if (originalApplication) {
        setLocalApplications(prev => [...prev, originalApplication]);
      }
    }
  };
  
  // Função para manusear a aprovação
  const handleApprove = async (applicationId: string, providerId: string) => {
    try {
      console.log(`ApplicationsList: Iniciando aprovação de candidatura ${applicationId}`);
      await handleApproveApplication(applicationId, providerId);
      console.log(`ApplicationsList: Candidatura ${applicationId} aprovada com sucesso`);
    } catch (error: any) {
      console.error(`ApplicationsList: Erro ao aprovar candidatura ${applicationId}:`, error);
    }
  };
  
  // Ordenar aplicações: pendentes primeiro, depois aceitas, por fim rejeitadas
  const sortedApplications = [...localApplications].sort((a, b) => {
    const statusOrder = { pending: 0, accepted: 1, rejected: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
  
  if (isLoading) {
    return <div className="text-center py-8">Carregando candidaturas...</div>;
  }
  
  if (sortedApplications.length === 0) {
    // Usando um Card simples em vez do EmptyState que não existe
    return (
      <Card className="text-center py-8">
        <CardContent className="pt-6">
          <p className="text-lg font-medium">Sem candidaturas</p>
          <p className="text-sm text-muted-foreground">Ainda não há candidaturas para este evento.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidaturas ({sortedApplications.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedApplications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onApprove={handleApprove}
            onReject={handleReject}
            isDisabled={isProcessing}
          />
        ))}
      </CardContent>
    </Card>
  );
};
