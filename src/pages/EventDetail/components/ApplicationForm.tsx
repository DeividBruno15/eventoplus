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
  
  // Track when a new application is created
  const [justApplied, setJustApplied] = useState(false);
  
  // Update local state when userApplication changes
  useEffect(() => {
    if (userApplication) {
      console.log('Application status updated in form:', userApplication.status);
      setApplicationStatus(userApplication.status);
      
      // Reset success state if we have an application record
      if (showSuccess) {
        setShowSuccess(false);
      }
    } else {
      setApplicationStatus(null);
      
      // If we had an application but now it's null and we just applied,
      // keep showing success message until the application is fetched
      if (!justApplied) {
        setShowSuccess(false);
      }
    }
  }, [userApplication, showSuccess, justApplied]);
  
  const handleSubmit = async (message: string, serviceCategory?: string) => {
    setJustApplied(true);
    await onSubmit(message, serviceCategory);
    setShowSuccess(true);
    
    // Reset the "just applied" flag after a short time
    setTimeout(() => {
      setJustApplied(false);
    }, 5000);
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
    combinedRejectedStatus: hasBeenRejected,
    showSuccess,
    justApplied
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
        ) : userApplication ? (
          <ExistingApplication 
            userApplication={userApplication}
            onCancelApplication={handleCancel}
          />
        ) : showSuccess ? (
          <ApplicationSuccess />
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
