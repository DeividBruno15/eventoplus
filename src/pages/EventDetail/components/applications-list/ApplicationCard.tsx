
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
  // Use typed local state for status
  const [localStatus, setLocalStatus] = useState<"pending" | "accepted" | "rejected">(application.status);
  
  // Update the local state when the prop changes
  useEffect(() => {
    if (application.status !== localStatus) {
      console.log(`ApplicationCard: Status updating from ${localStatus} to ${application.status} for application ${application.id}`);
      setLocalStatus(application.status);
    }
  }, [application.status, application.id, localStatus]);
  
  // Handlers with immediate UI feedback
  const handleApprove = async () => {
    try {
      setLocalStatus('accepted');
      console.log(`Setting local status to accepted for application ${application.id}`);
      await onApprove(application.id, application.provider_id);
    } catch (error) {
      // In case of error, revert to the original status
      console.error('Error approving application, reverting status:', error);
      setLocalStatus(application.status);
    }
  };
  
  const handleReject = async () => {
    try {
      setLocalStatus('rejected');
      console.log(`Setting local status to rejected for application ${application.id}`);
      await onReject(application.id, application.provider_id);
    } catch (error) {
      // In case of error, revert to the original status
      console.error('Error rejecting application, reverting status:', error);
      setLocalStatus(application.status);
    }
  };
  
  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Use localStatus for UI for immediate feedback
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
