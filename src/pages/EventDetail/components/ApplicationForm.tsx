
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Event, EventApplication } from '@/types/events';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ApplicationSuccess } from './application-form/ApplicationSuccess';
import { LoadingServices } from './application-form/LoadingServices';
import { ExistingApplication } from './application-form/ExistingApplication';
import { ApplicationFormContent } from './application-form/ApplicationFormContent';
import { toast } from 'sonner';

interface ApplicationFormProps {
  event: Event;
  onSubmit: (message: string, serviceCategory?: string) => Promise<void>;
  userApplication: EventApplication | null;
  submitting: boolean;
  onCancelApplication: (applicationId: string) => Promise<void>; // Added missing prop
}

interface UserService {
  id: string;
  category: string;
  description?: string | null;
}

export const ApplicationForm = ({ event, onSubmit, userApplication, submitting, onCancelApplication }: ApplicationFormProps) => {
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [userServices, setUserServices] = useState<UserService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Fetch user services
  useEffect(() => {
    if (!user) return;
    
    const fetchUserServices = async () => {
      setLoadingServices(true);
      try {
        const { data, error } = await supabase
          .from('provider_services')
          .select('id, category, description')
          .eq('provider_id', user.id);
          
        if (error) {
          console.error('Error fetching provider services:', error);
          return;
        }
        
        console.log('Fetched provider services:', data);
        
        // Filter services to match event service type if specified
        const filteredServices = event.service_type 
          ? (data || []).filter(service => service.category === event.service_type)
          : data || [];
        
        setUserServices(filteredServices);
        
        console.log('Filtered services:', filteredServices);
      } catch (err) {
        console.error('Failed to fetch provider services:', err);
      } finally {
        setLoadingServices(false);
      }
    };
    
    fetchUserServices();
  }, [user, event]);

  const handleSubmitApplication = async (message: string, serviceCategory?: string) => {
    try {
      console.log('Submitting application with service:', serviceCategory);
      await onSubmit(message, serviceCategory);
      setShowSuccess(true);
    } catch (error) {
      console.error("Erro ao enviar candidatura:", error);
    }
  };

  // Handle cancel application
  const handleCancelApplication = async () => {
    if (!userApplication) return;
    
    try {
      await onCancelApplication(userApplication.id);
    } catch (error) {
      toast.error("Erro ao cancelar candidatura");
    }
  };

  return (
    <Card className="mb-6">
      {showSuccess ? (
        <ApplicationSuccess />
      ) : loadingServices ? (
        <LoadingServices />
      ) : userApplication ? (
        <CardContent className="pt-6">
          <ExistingApplication 
            userApplication={userApplication}
            onCancelApplication={handleCancelApplication}
          />
        </CardContent>
      ) : (
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-3">Candidatar-se a este evento</h3>
          <ApplicationFormContent 
            userServices={userServices}
            submitting={submitting}
            onSubmit={handleSubmitApplication}
          />
        </CardContent>
      )}
    </Card>
  );
};
