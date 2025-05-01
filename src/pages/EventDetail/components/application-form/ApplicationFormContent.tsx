
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { ServiceSelection } from './ServiceSelection';
import { NoCompatibleServices } from './NoCompatibleServices';
import { Event } from '@/types/events';

interface UserService {
  id: string;
  category: string;
  description?: string | null;
}

interface ApplicationFormContentProps {
  event: Event;
  userServices?: UserService[];
  submitting: boolean;
  onSubmit: (message: string, serviceCategory?: string) => Promise<void>;
}

export const ApplicationFormContent = ({ event, userServices = [], submitting, onSubmit }: ApplicationFormContentProps) => {
  const [applicationMessage, setApplicationMessage] = useState('');
  const [selectedService, setSelectedService] = useState<string>('');
  
  // Auto-select the service if there's only one available
  useEffect(() => {
    if (userServices.length === 1) {
      setSelectedService(userServices[0].category);
    }
  }, [userServices]);
  
  const handleSubmitApplication = async () => {
    try {
      await onSubmit(applicationMessage, selectedService);
    } catch (error) {
      console.error("Erro ao enviar candidatura:", error);
    }
  };
  
  if (userServices.length === 0) {
    return <NoCompatibleServices />;
  }
  
  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">
        Explique por que você é a pessoa ideal para este serviço.
      </p>
      
      {userServices.length > 1 && (
        <ServiceSelection
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          userServices={userServices}
        />
      )}
      
      <Textarea
        placeholder="Descreva sua experiência e por que você é uma boa escolha para este evento..."
        className="mb-4"
        rows={4}
        value={applicationMessage}
        onChange={(e) => setApplicationMessage(e.target.value)}
      />
      
      <Button 
        className="w-full" 
        onClick={handleSubmitApplication}
        disabled={submitting || !applicationMessage.trim() || (userServices.length > 1 && !selectedService)}
      >
        {submitting ? 
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </> : 
          'Enviar candidatura'
        }
      </Button>
    </>
  );
};
