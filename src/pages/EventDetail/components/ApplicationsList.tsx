import { useState } from 'react';
import { EventApplication } from '@/types/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface ApplicationsListProps {
  applications: EventApplication[];
  onApprove: (applicationId: string, providerId: string) => void;
  onReject: (applicationId: string) => void;
  submitting: boolean;
}

export const ApplicationsList = ({ 
  applications, 
  onApprove, 
  onReject, 
  submitting 
}: ApplicationsListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const renderProviderInfo = (providerId: string, providerName: string, avatar?: string | null) => (
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 mr-3">
        {avatar ? (
          <img src={avatar} alt={providerName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <User className="text-primary/60 w-5 h-5" />
          </div>
        )}
      </div>
      <div>
        <Link 
          to={`/user-profile/${providerId}`} 
          className="font-medium hover:text-primary hover:underline"
        >
          {providerName}
        </Link>
        <p className="text-xs text-gray-500">Prestador de serviços</p>
      </div>
    </div>
  );
  
  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Ainda não há candidaturas para este evento.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const isExpanded = expandedId === application.id;
        const providerName = application.provider ? 
          `${application.provider.first_name} ${application.provider.last_name}` : 
          'Prestador';
        
        return (
          <Card key={application.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex justify-between items-center">
                {application.provider && renderProviderInfo(
                  application.provider.id,
                  providerName,
                  application.provider.avatar_url
                )}
                
                <div className="flex items-center">
                  <Badge 
                    variant={
                      application.status === 'accepted' ? 'success' : 
                      application.status === 'rejected' ? 'destructive' : 
                      'outline'
                    }
                    className="mr-4"
                  >
                    {application.status === 'accepted' ? 'Aprovado' : 
                     application.status === 'rejected' ? 'Recusado' : 
                     'Pendente'}
                  </Badge>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleExpand(application.id)}
                  >
                    {isExpanded ? 'Menos detalhes' : 'Ver detalhes'}
                  </Button>
                </div>
              </div>
              
              {isExpanded && (
                <div className="border-t p-4">
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Categoria:</span>
                      <span className="text-sm">{application.service_category}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Data da candidatura:</span>
                      <span className="text-sm">
                        {formatDistanceToNow(new Date(application.created_at), { 
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Mensagem:</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded-md">
                      {application.message || "Nenhuma mensagem fornecida."}
                    </p>
                  </div>
                  
                  {application.status === 'pending' && (
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReject(application.id)}
                        disabled={submitting}
                        className="flex items-center"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Recusar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => application.provider && onApprove(application.id, application.provider.id)}
                        disabled={submitting}
                        className="flex items-center"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Aprovar
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
