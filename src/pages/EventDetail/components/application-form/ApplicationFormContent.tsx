import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Event } from '@/types/events';
import { useAuth } from '@/hooks/useAuth';
import { NoCompatibleServices } from './NoCompatibleServices';
import { LoadingServices } from './LoadingServices';
import { supabase } from '@/integrations/supabase/client';

interface UserService {
  id: string;
  category: string;
}

interface ApplicationFormContentProps {
  event: Event;
  userServices: UserService[];
  onSubmit: (message: string, serviceCategory?: string) => Promise<void>;
  submitting: boolean;
}

export const ApplicationFormContent = ({
  event,
  userServices: initialServices,
  onSubmit,
  submitting
}: ApplicationFormContentProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [userServices, setUserServices] = useState<UserService[]>(initialServices);
  const [loading, setLoading] = useState(false);
  const [isDefaultServiceSelected, setIsDefaultServiceSelected] = useState(true);
  
  // Fetch user's services from the database
  useEffect(() => {
    const fetchUserServices = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('provider_services')
          .select('id, category')
          .eq('provider_id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log('Fetched user services:', data);
          setUserServices(data);
          // Select the service matching the event's service type if available
          const matchingService = data.find(service => 
            service.category.toLowerCase() === event.service_type?.toLowerCase()
          );
          
          if (matchingService) {
            console.log('Found matching service:', matchingService);
            setSelectedService(matchingService.category);
            setIsDefaultServiceSelected(true);
          } else {
            // Otherwise, select the first service
            console.log('No matching service found, using first service');
            setSelectedService(data[0].category);
            setIsDefaultServiceSelected(false);
          }
        } else {
          // If no services found, use the event's service type as default
          console.log('No user services found, using event service type');
          setSelectedService(event.service_type || '');
          setIsDefaultServiceSelected(true);
        }
      } catch (error) {
        console.error('Error fetching user services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserServices();
  }, [user, event.service_type]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit(message, selectedService);
  };

  // If loading services, show loading indicator
  if (loading) {
    return <LoadingServices />;
  }

  // If no compatible services are available, show message
  if (userServices.length === 0) {
    return <NoCompatibleServices eventType={event.service_type} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="service">Categoria de serviço</Label>
        <Select
          value={selectedService}
          onValueChange={(value) => {
            setSelectedService(value);
            setIsDefaultServiceSelected(value === event.service_type);
          }}
          disabled={submitting}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a categoria de serviço" />
          </SelectTrigger>
          <SelectContent>
            {userServices.map((service) => (
              <SelectItem key={service.id} value={service.category}>
                {service.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isDefaultServiceSelected && (
          <p className="text-xs text-amber-600">
            Atenção: A categoria selecionada é diferente da categoria solicitada pelo evento.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensagem para o contratante</Label>
        <Textarea
          id="message"
          placeholder="Descreva brevemente por que você é a pessoa ideal para este evento..."
          className="min-h-[120px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={submitting || !message.trim()}>
        {submitting ? 'Enviando...' : 'Enviar Candidatura'}
      </Button>
    </form>
  );
};
