
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  
  // Update local state when userApplication changes
  useEffect(() => {
    if (userApplication) {
      console.log('Application status updated in form:', userApplication.status);
      setApplicationStatus(userApplication.status);
    } else {
      setApplicationStatus(null);
    }
  }, [userApplication]);
  
  const handleSubmit = async (message: string, serviceCategory?: string) => {
    await onSubmit(message, serviceCategory);
    setShowSuccess(true);
  };
  
  const handleCancel = () => {
    if (userApplication) {
      onCancelApplication(userApplication.id);
    }
  };
  
  // Verificar se a aplicação já foi rejeitada - múltiplas checagens para garantir
  const hasBeenRejected = 
    isRejected === true ||
    applicationStatus === 'rejected' ||
    userApplication?.status === 'rejected';
  
  console.log('Application form rendering with status:', {
    explicitRejected: isRejected,
    localStatus: applicationStatus,
    userApplicationStatus: userApplication?.status,
    combinedRejectedStatus: hasBeenRejected
  });
  
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
    </Card>
  );
};
