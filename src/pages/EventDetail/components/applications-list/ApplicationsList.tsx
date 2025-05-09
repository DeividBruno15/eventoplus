
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventApplication } from '@/types/events';
import { ApplicationCard } from './ApplicationCard';
import { useEffect, useState } from 'react';
import { Event } from '@/types/events';
import { useApplicationsList } from './useApplicationsList';

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

  // Use the applications list management hook
  const {
    localApplications,
    processingIds,
    handleApprove,
    handleReject,
    isButtonDisabled
  } = useApplicationsList(applications);

  // Debug: Monitor applications updates
  useEffect(() => {
    console.log('ApplicationsList received new applications:', applications.length);
    console.log('Current local applications:', localApplications.length);
  }, [applications, localApplications]);
  
  if (isLoading) {
    return <div className="text-center py-8">Carregando candidaturas...</div>;
  }
  
  if (localApplications.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent className="pt-6">
          <p className="text-lg font-medium">Sem candidaturas</p>
          <p className="text-sm text-muted-foreground">Ainda não há candidaturas para este evento.</p>
        </CardContent>
      </Card>
    );
  }
  
  const onApproveHandler = async (applicationId: string, providerId: string) => {
    await handleApprove(applicationId, providerId, async (id, pId) => {
      if (event) {
        console.log(`Approving application ${id} from provider ${pId}`);
        if (onApplicationStatusChange) {
          await onApplicationStatusChange(id, 'accepted');
        }
      }
    });
  };
  
  const onRejectHandler = async (applicationId: string, providerId: string) => {
    await handleReject(applicationId, providerId, async (id, pId) => {
      if (event) {
        console.log(`Rejecting application ${id} from provider ${pId}`);
        if (onApplicationStatusChange) {
          await onApplicationStatusChange(id, 'rejected');
        }
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidaturas ({localApplications.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {localApplications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onApprove={onApproveHandler}
            onReject={onRejectHandler}
            isDisabled={isButtonDisabled(application.id, isLoading, event?.status || '')}
          />
        ))}
      </CardContent>
    </Card>
  );
};
