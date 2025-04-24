
import { useNavigate } from 'react-router-dom'; 
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, User } from 'lucide-react';
import { EventApplication } from '@/types/events';
import { Separator } from '@/components/ui/separator';
import { getApplicationStatusColor } from '@/lib/utils';

interface ApplicationsListProps {
  applications: EventApplication[];
  onApprove: (applicationId: string, providerId: string) => Promise<void>;
  submitting: boolean;
  eventStatus: string;
}

export const ApplicationsList = ({ applications, onApprove, submitting, eventStatus }: ApplicationsListProps) => {
  const navigate = useNavigate();
  
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
              <div key={app.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">
                      {app.provider ? `${app.provider.first_name} ${app.provider.last_name}` : 'Usuário'}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getApplicationStatusColor(app.status)} text-white`}
                  >
                    {app.status === 'pending' ? 'Pendente' : 
                     app.status === 'approved' ? 'Aprovada' : 
                     app.status === 'rejected' ? 'Rejeitada' : 'Desconhecido'}
                  </Badge>
                </div>
                
                <p className="text-sm whitespace-pre-line border-l-2 pl-3 py-1 border-gray-200 bg-gray-50 mb-3">
                  {app.message}
                </p>
                
                {app.status === 'pending' && (eventStatus === 'open' || eventStatus === 'published') && (
                  <Button 
                    onClick={() => onApprove(app.id, app.provider_id)}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Aprovando...
                      </> : 
                      'Aprovar Prestador'
                    }
                  </Button>
                )}
                
                {app.status === 'approved' && (
                  <Button 
                    onClick={() => navigate('/chat')}
                    className="w-full"
                  >
                    Conversar com o prestador
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
