
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApplicationFormContent } from './application-form/ApplicationFormContent';
import { ApplicationSuccess } from './application-form/ApplicationSuccess';
import { Event, EventApplication } from '@/types/events';
import { ExistingApplication } from './application-form/ExistingApplication';

interface ApplicationFormProps {
  event: Event;
  onSubmit: (message: string, serviceCategory?: string) => Promise<void>;
  userApplication: EventApplication | null;
  submitting: boolean;
  onCancelApplication: (applicationId: string) => Promise<void>;
  isRejected?: boolean;
}

export const ApplicationForm = ({
  event,
  onSubmit,
  userApplication,
  submitting,
  onCancelApplication,
  isRejected
}: ApplicationFormProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSubmit = async (message: string, serviceCategory?: string) => {
    await onSubmit(message, serviceCategory);
    setShowSuccess(true);
  };
  
  const handleCancel = () => {
    if (userApplication) {
      onCancelApplication(userApplication.id);
    }
  };
  
  // Verificar se a aplicação já foi rejeitada
  const hasBeenRejected = isRejected || userApplication?.status === 'rejected';
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Candidatar-se para este evento</CardTitle>
      </CardHeader>
      <CardContent>
        {hasBeenRejected ? (
          <div className="text-center my-4 p-4 border border-red-300 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">Sua candidatura para este evento foi rejeitada.</p>
            <p className="text-gray-600 mt-2">Infelizmente, você não pode se candidatar novamente para este evento.</p>
          </div>
        ) : showSuccess ? (
          <ApplicationSuccess />
        ) : userApplication ? (
          <ExistingApplication 
            userApplication={userApplication}
            onCancelApplication={handleCancel}
          />
        ) : (
          <ApplicationFormContent 
            event={event}
            userServices={[{ id: '1', category: event.service_type }]}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </CardContent>
      {!userApplication && !showSuccess && !hasBeenRejected && (
        <CardFooter className="flex justify-end border-t p-4">
          <Button 
            disabled={submitting} 
            type="submit" 
            form="application-form"
          >
            {submitting ? 'Enviando...' : 'Enviar Candidatura'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
