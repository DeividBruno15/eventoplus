
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getApplicationStatusColor } from '@/lib/utils';
import { EventApplication } from '@/types/events';
import { ApplicationMessage } from './ApplicationMessage';
import { ApprovedApplication } from './ApprovedApplication';

interface ExistingApplicationProps {
  userApplication: EventApplication;
  onCancelApplication: () => void;
}

export const ExistingApplication = ({ userApplication, onCancelApplication }: ExistingApplicationProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Sua candidatura</h3>
        <Badge 
          variant="outline" 
          className={`${getApplicationStatusColor(userApplication.status)} text-white`}
        >
          {userApplication.status === 'pending' ? 'Pendente' : 
           userApplication.status === 'accepted' ? 'Aprovada' : 
           userApplication.status === 'rejected' ? 'Rejeitada' : 'Desconhecido'}
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
    </>
  );
};
