
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventApplication, EventStatus } from '@/types/events';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

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
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getProviderInitials = (application: EventApplication) => {
    if (!application.provider) return 'U';
    
    const { first_name, last_name } = application.provider;
    return `${first_name?.charAt(0) || ''}${last_name?.charAt(0) || ''}`.toUpperCase() || 'U';
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex gap-1 items-center"><Clock className="h-3 w-3" /> Pendente</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-500 flex gap-1 items-center"><CheckCircle className="h-3 w-3" /> Aceito</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex gap-1 items-center"><XCircle className="h-3 w-3" /> Recusado</Badge>;
      default:
        return <Badge variant="outline" className="flex gap-1 items-center"><AlertCircle className="h-3 w-3" /> {status}</Badge>;
    }
  };
  
  // Separate applications by status
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidaturas ao Evento</CardTitle>
        <CardDescription>
          Gerencie candidaturas de prestadores para seu evento
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {applications.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Nenhuma candidatura recebida ainda
          </div>
        ) : (
          <>
            {pendingApplications.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Candidaturas Pendentes</h3>
                {pendingApplications.map(application => (
                  <div key={application.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {application.provider?.avatar_url ? (
                            <AvatarImage src={application.provider.avatar_url} />
                          ) : (
                            <AvatarFallback>{getProviderInitials(application)}</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="font-medium">
                          {application.provider ? 
                            `${application.provider.first_name} ${application.provider.last_name || ''}` : 
                            'Usuário'}
                        </span>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-2">
                      Categoria: {application.service_category || "Não especificada"}
                    </div>
                    
                    <div className="mb-4">
                      <div 
                        className={`text-sm ${expandedIds[application.id] ? '' : 'line-clamp-2'}`}
                      >
                        {application.message}
                      </div>
                      {application.message.length > 100 && (
                        <button 
                          onClick={() => toggleExpand(application.id)} 
                          className="text-xs text-primary mt-1"
                        >
                          {expandedIds[application.id] ? 'Mostrar menos' : 'Mostrar mais'}
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReject(application.id, application.provider_id)}
                        disabled={submitting || eventStatus !== 'open'}
                      >
                        Recusar
                      </Button>
                      
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => onApprove(application.id, application.provider_id)}
                        disabled={submitting || eventStatus !== 'open'}
                      >
                        Aprovar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {acceptedApplications.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Candidaturas Aceitas</h3>
                {acceptedApplications.map(application => (
                  <div key={application.id} className="border rounded-md p-4 border-green-200 bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {application.provider?.avatar_url ? (
                            <AvatarImage src={application.provider.avatar_url} />
                          ) : (
                            <AvatarFallback>{getProviderInitials(application)}</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="font-medium">
                          {application.provider ? 
                            `${application.provider.first_name} ${application.provider.last_name || ''}` : 
                            'Usuário'}
                        </span>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Categoria: {application.service_category || "Não especificada"}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {rejectedApplications.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Candidaturas Recusadas</h3>
                {rejectedApplications.map(application => (
                  <div key={application.id} className="border rounded-md p-4 border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {application.provider?.avatar_url ? (
                            <AvatarImage src={application.provider.avatar_url} />
                          ) : (
                            <AvatarFallback>{getProviderInitials(application)}</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="font-medium">
                          {application.provider ? 
                            `${application.provider.first_name} ${application.provider.last_name || ''}` : 
                            'Usuário'}
                        </span>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Categoria: {application.service_category || "Não especificada"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
