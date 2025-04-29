
import { useNavigate } from 'react-router-dom'; 
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, Check, X } from 'lucide-react';
import { EventApplication } from '@/types/events';
import { Separator } from '@/components/ui/separator';
import { getApplicationStatusColor } from '@/lib/utils';
import { useState } from 'react';

interface ApplicationsListProps {
  applications: EventApplication[];
  onApprove: (applicationId: string, providerId: string) => Promise<void>;
  onReject?: (applicationId: string, providerId: string) => Promise<void>;
  submitting: boolean;
  eventStatus: string;
}

export const ApplicationsList = ({ 
  applications, 
  onApprove, 
  onReject, 
  submitting, 
  eventStatus 
}: ApplicationsListProps) => {
  const navigate = useNavigate();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  
  console.log("Applications in ApplicationsList:", applications);
  
  const handleViewProfile = (providerId: string) => {
    navigate(`/provider-profile/${providerId}`);
  };
  
  const handleRejectApplication = async (applicationId: string, providerId: string) => {
    if (onReject) {
      setActionInProgress(applicationId);
      try {
        await onReject(applicationId, providerId);
      } finally {
        setActionInProgress(null);
      }
    } else {
      toast.error("Função de rejeição não implementada");
    }
  };

  const handleApproveApplication = async (applicationId: string, providerId: string) => {
    setActionInProgress(applicationId);
    try {
      await onApprove(applicationId, providerId);
      // Navigation to chat will happen in the onApprove handler itself
    } finally {
      setActionInProgress(null);
    }
  };
  
  const getProviderInitials = (app: EventApplication) => {
    if (!app.provider) return 'U';
    const { first_name, last_name } = app.provider;
    return `${first_name?.charAt(0) || ''}${last_name ? last_name.charAt(0) : ''}`.toUpperCase() || 'U';
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium text-lg mb-4">Candidaturas</h3>
        
        {applications.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            Ainda não há candidaturas para este evento
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className={`border rounded-md p-4 ${app.status === 'rejected' ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      {app.provider?.avatar_url ? (
                        <AvatarImage 
                          src={app.provider.avatar_url} 
                          alt={app.provider?.first_name || 'Provider'} 
                        />
                      ) : (
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getProviderInitials(app)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <span className="font-medium">
                        {app.provider ? `${app.provider.first_name} ${app.provider.last_name || ''}` : 'Usuário'}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {app.service_category && <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{app.service_category}</span>}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getApplicationStatusColor(app.status)} text-white`}
                  >
                    {app.status === 'pending' ? 'Pendente' : 
                     app.status === 'accepted' ? 'Aprovada' : 
                     app.status === 'rejected' ? 'Rejeitada' : 'Desconhecido'}
                  </Badge>
                </div>
                
                <p className="text-sm whitespace-pre-line border-l-2 pl-3 py-1 border-gray-200 bg-gray-50 mb-4">
                  {app.message}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProfile(app.provider_id)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Ver perfil completo
                  </Button>
                
                  {app.status === 'pending' && (eventStatus === 'open' || eventStatus === 'published') && (
                    <>
                      <Button 
                        onClick={() => handleApproveApplication(app.id, app.provider_id)}
                        disabled={submitting || actionInProgress !== null}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {(submitting || actionInProgress === app.id) ? (
                          <>
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            Aprovando...
                          </>
                        ) : (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            Aprovar
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={() => handleRejectApplication(app.id, app.provider_id)}
                        disabled={submitting || actionInProgress !== null}
                        size="sm"
                        variant="destructive"
                      >
                        {(submitting || actionInProgress === app.id) ? (
                          <>
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            Rejeitando...
                          </>
                        ) : (
                          <>
                            <X className="mr-1 h-4 w-4" />
                            Rejeitar
                          </>
                        )}
                      </Button>
                    </>
                  )}
                  
                  {app.status === 'accepted' && (
                    <Button 
                      onClick={() => navigate('/chat')}
                      size="sm"
                    >
                      Conversar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
