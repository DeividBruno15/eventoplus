import { Event, EventApplication } from '@/types/events';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationsList } from './applications-list';
import { useEffect } from 'react';
import { useRejectionState } from '../hooks/useEventStateBackup';

interface EventActionPanelProps {
  userRole: 'provider' | 'contractor' | null;
  event: Event;
  userId: string | undefined;
  applications: EventApplication[];
  userApplication: EventApplication | null;
  submitting: boolean;
  handleApply: (message: string, serviceCategory?: string) => Promise<void>;
  handleApproveApplication: (applicationId: string, providerId: string) => Promise<void>;
  handleRejectApplication: (applicationId: string, providerId: string, reason?: string) => Promise<void>;
  handleCancelApplication: (applicationId: string) => Promise<void>;
}

export const EventActionPanel = ({
  userRole,
  event,
  userId,
  applications,
  userApplication,
  submitting,
  handleApply,
  handleApproveApplication,
  handleRejectApplication,
  handleCancelApplication
}: EventActionPanelProps) => {
  console.log("Applications in EventActionPanel:", applications);
  console.log("Current user role:", userRole);
  console.log("Event contractor ID:", event.contractor_id);
  console.log("Current user ID:", userId);
  console.log("Is user the event contractor?", event.contractor_id === userId);
  console.log("Current user application:", userApplication);

  // Usar o sistema de filtro de rejeições
  const { filterRejectedApplications, getRejectedIds } = useRejectionState(event?.id);
  
  // Verificar rejeições
  useEffect(() => {
    const rejectedIds = getRejectedIds();
    if (rejectedIds.size > 0) {
      console.log(`EventActionPanel: ${rejectedIds.size} candidaturas rejeitadas localmente`);
    }
  }, [getRejectedIds]);

  useEffect(() => {
    if (userApplication) {
      console.log("User application status in EventActionPanel:", userApplication.status);
    }
  }, [userApplication]);

  // Filtrar candidaturas rejeitadas da lista
  const filteredApplications = filterRejectedApplications(applications);
  console.log(`Filtragem: ${applications.length} originais, ${filteredApplications.length} após filtro`);

  // Check if there are any accepted applications for this event
  const hasAcceptedApplications = applications.some(app => app.status === 'accepted');
  
  // Verifica se a candidatura atual do usuário foi rejeitada
  const isRejected = userApplication?.status === 'rejected';
  
  console.log("Is application rejected?", isRejected);
  console.log("User application full data:", userApplication);
  
  // Debug: Visualizar todas as aplicações e seus status
  useEffect(() => {
    if (filteredApplications.length > 0) {
      console.log("All applications and their statuses (after filtering):");
      filteredApplications.forEach(app => {
        console.log(`Application ${app.id} - Status: ${app.status} - Provider: ${app.provider_id}`);
      });
    }
  }, [filteredApplications]);
  
  // Função de callback para atualização de status
  const handleApplicationStatusChange = (applicationId: string, status: 'accepted' | 'rejected') => {
    console.log(`EventActionPanel: Atualizando status da aplicação ${applicationId} para ${status}`);
    if (status === 'accepted') {
      // Não fazer nada adicional para aprovações aqui - já está implementado em handleApproveApplication
    } else if (status === 'rejected') {
      // Não fazer nada adicional para rejeições aqui - já está implementado em handleRejectApplication
    }
  };
  
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {userRole === 'provider' && (
        <div>
          <ApplicationForm 
            event={event}
            onSubmit={handleApply}
            userApplication={userApplication}
            submitting={submitting}
            onCancelApplication={handleCancelApplication}
            isRejected={isRejected}
          />
        </div>
      )}
      
      {userId === event.contractor_id && (
        <div>
          <ApplicationsList 
            event={event}
            applications={filteredApplications}
            isLoading={submitting}
            onApplicationStatusChange={handleApplicationStatusChange}
          />
        </div>
      )}
    </div>
  );
};
