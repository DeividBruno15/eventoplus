
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { EventApplication } from '@/types/events';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: EventApplication;
  onApprove: (applicationId: string, providerId: string) => Promise<void>;
  onReject: (applicationId: string, providerId: string) => Promise<void>;
  isDisabled: boolean;
}

export const ApplicationCard = ({ 
  application, 
  onApprove, 
  onReject, 
  isDisabled 
}: ApplicationCardProps) => {
  // Adicionar estado local para controlar o status durante transições
  const [localStatus, setLocalStatus] = useState(application.status);
  
  // Atualizar o estado local quando a prop muda
  useEffect(() => {
    setLocalStatus(application.status);
    console.log(`ApplicationCard: Status atualizado para ${application.status} para aplicação ${application.id}`);
  }, [application.status, application.id]);
  
  // Handlers com feedback imediato na UI
  const handleApprove = async () => {
    setLocalStatus('accepted');
    await onApprove(application.id, application.provider_id);
  };
  
  const handleReject = async () => {
    setLocalStatus('rejected');
    await onReject(application.id, application.provider_id);
  };
  
  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Usar o localStatus para a UI para feedback imediato
  return (
    <Card 
      className={cn(
        "overflow-hidden", 
        localStatus === 'accepted' ? "border-green-500 bg-green-50" : 
        localStatus === 'rejected' ? "border-red-500 bg-red-50" : ""
      )}
    >
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
            localStatus === 'accepted' ? 'default' :
            localStatus === 'rejected' ? 'destructive' :
            'outline'
          }>
            {localStatus === 'accepted' ? 'Aprovado' :
             localStatus === 'rejected' ? 'Rejeitado' :
             'Pendente'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Categoria: {application.service_category}</p>
          <p className="text-sm text-gray-700">{application.message}</p>
        </div>
        
        {localStatus === 'pending' && (
          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              disabled={isDisabled}
            >
              <X className="h-4 w-4 mr-1" />
              Recusar
            </Button>
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isDisabled}
            >
              <Check className="h-4 w-4 mr-1" />
              Aprovar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
