
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EventApplication } from '@/types/events';
import { ApplicationMessage } from './ApplicationMessage';
import { ApprovedApplication } from './ApprovedApplication';

interface ExistingApplicationProps {
  userApplication: EventApplication;
  onCancelApplication: () => void;
}

export const ExistingApplication = ({ userApplication, onCancelApplication }: ExistingApplicationProps) => {
  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };
  
  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      default: return 'Pendente';
    }
  };
  
  // Set container class based on status
  const containerClass = cn(
    userApplication.status === 'accepted' ? 'border-green-500 bg-green-50' : 
    userApplication.status === 'rejected' ? 'border-red-500 bg-red-50' : 
    ''
  );
  
  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Sua candidatura</h3>
        <Badge 
          variant="outline" 
          className={cn("text-white", getApplicationStatusColor(userApplication.status))}
        >
          {getApplicationStatusText(userApplication.status)}
        </Badge>
      </div>
      
      <ApplicationMessage message={userApplication.message} className="mb-4" />
      
      {userApplication.status === 'pending' && (
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={onCancelApplication}
        >
          Cancelar Candidatura
        </Button>
      )}
      
      {userApplication.status === 'accepted' && (
        <ApprovedApplication />
      )}
      
      {userApplication.status === 'rejected' && (
        <div className="text-center my-4 p-4">
          <p className="text-red-600">Sua candidatura para este evento foi rejeitada.</p>
        </div>
      )}
    </div>
  );
};
