
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { EventApplication, EventStatus } from '@/types/events';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ApplicationsListProps {
  applications: EventApplication[];
  onApprove: (applicationId: string, providerId: string) => Promise<void>;
  onReject: (applicationId: string, providerId: string) => Promise<void>;
  submitting: boolean;
  eventStatus: EventStatus;
}

export const ApplicationsList = ({
  applications,
  onApprove,
  onReject,
  submitting,
  eventStatus
}: ApplicationsListProps) => {
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  
  const handleApprove = async (applicationId: string, providerId: string) => {
    try {
      setProcessingIds(prev => [...prev, applicationId]);
      await onApprove(applicationId, providerId);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== applicationId));
    }
  };
  
  const handleReject = async (applicationId: string, providerId: string) => {
    try {
      setProcessingIds(prev => [...prev, applicationId]);
      await onReject(applicationId, providerId);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== applicationId));
    }
  };
  
  const isButtonDisabled = (applicationId: string) => {
    return submitting || processingIds.includes(applicationId) || eventStatus === 'closed';
  };
  
  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Candidaturas</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Nenhuma candidatura</AlertTitle>
            <AlertDescription>
              Ainda não há prestadores de serviços interessados neste evento.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidaturas ({applications.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="overflow-hidden">
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={application.provider?.avatar_url || ''} />
                    <AvatarFallback>
                      {application.provider ? getInitials(application.provider.first_name, application.provider.last_name) : '??'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {application.provider?.first_name} {application.provider?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(application.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                <Badge variant={
                  application.status === 'accepted' ? 'default' :
                  application.status === 'rejected' ? 'destructive' :
                  'outline'
                }>
                  {application.status === 'accepted' ? 'Aprovado' :
                   application.status === 'rejected' ? 'Rejeitado' :
                   'Pendente'}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Categoria: {application.service_category}</p>
                <p className="text-sm text-gray-700">{application.message}</p>
              </div>
              
              {application.status === 'pending' && (
                <div className="flex gap-2 justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(application.id, application.provider_id)}
                    disabled={isButtonDisabled(application.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Recusar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(application.id, application.provider_id)}
                    disabled={isButtonDisabled(application.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

// Skeleton loader for applications list
export const ApplicationsListSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
