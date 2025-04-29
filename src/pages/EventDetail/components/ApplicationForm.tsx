
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Event, EventApplication } from '@/types/events';
import { getApplicationStatusColor } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ApplicationFormProps {
  event: Event;
  onSubmit: (message: string, serviceCategory?: string) => Promise<void>;
  userApplication: EventApplication | null;
  submitting: boolean;
}

interface UserService {
  id: string;
  category: string;
  description?: string | null;
}

export const ApplicationForm = ({ event, onSubmit, userApplication, submitting }: ApplicationFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [userServices, setUserServices] = useState<UserService[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');

  // Fetch user services
  useEffect(() => {
    if (!user) return;
    
    const fetchUserServices = async () => {
      const { data, error } = await supabase
        .from('provider_services')
        .select('id, category, description')
        .eq('provider_id', user.id);
        
      if (error) {
        console.error('Error fetching provider services:', error);
        return;
      }
      
      setUserServices(data || []);
      
      // If there's only one service, select it by default
      if (data && data.length === 1) {
        setSelectedService(data[0].category);
      }
      
      // If we have event service_type, try to match with provider services
      if (event.service_type && data) {
        const matchingService = data.find(service => service.category === event.service_type);
        if (matchingService) {
          setSelectedService(matchingService.category);
        }
      }
    };
    
    fetchUserServices();
  }, [user, event]);

  const handleSubmitApplication = async () => {
    try {
      const serviceToUse = userServices.length === 1 
        ? userServices[0].category 
        : selectedService;
        
      await onSubmit(applicationMessage, serviceToUse);
      setShowSuccess(true);
      toast.success("Candidatura enviada com sucesso!");
      
      // Reset form after 3 seconds and redirect back to event
      setTimeout(() => {
        setApplicationMessage('');
        setShowSuccess(false);
        navigate(`/events/${event.id}`);
      }, 3000);
    } catch (error) {
      console.error("Erro ao enviar candidatura:", error);
      toast.error("Erro ao enviar candidatura. Tente novamente.");
    }
  };

  if (showSuccess) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Candidatura Enviada!</h3>
          <p className="text-muted-foreground mb-4">
            Sua candidatura foi enviada com sucesso e está aguardando análise do contratante.
          </p>
          <Button onClick={() => navigate('/events')}>
            Ver Outros Eventos
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (userApplication) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
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
          
          <p className="text-sm whitespace-pre-line border-l-2 pl-4 py-1 border-primary/50 bg-primary/5 italic mb-4">
            {userApplication.message}
          </p>
          
          {userApplication.status === 'pending' && (
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => {
                // Cancel application functionality will be added in useEventApplications hook
                // This will be implemented in the next step
                toast.info("Aguarde um momento...");
              }}
            >
              Cancelar Candidatura
            </Button>
          )}
          
          {userApplication.status === 'accepted' && (
            <>
              <Separator className="my-4" />
              <div className="text-center">
                <p className="font-medium text-green-600 mb-2">
                  Parabéns! Sua candidatura foi aprovada.
                </p>
                <Button 
                  onClick={() => navigate('/chat')}
                  className="mt-2"
                >
                  Conversar com o contratante
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  // Check if user has compatible services for this event
  const hasCompatibleServices = userServices.length > 0;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="font-medium text-lg mb-3">Candidatar-se a este evento</h3>
        
        {!hasCompatibleServices ? (
          <div className="text-center py-4">
            <p className="text-amber-600 mb-4">
              Você precisa cadastrar serviços compatíveis antes de se candidatar a eventos.
            </p>
            <Button onClick={() => navigate('/profile')}>
              Configurar meus serviços
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Explique por que você é a pessoa ideal para este serviço.
            </p>
            
            {userServices.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecione o serviço para este evento:
                </label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {userServices.map((service) => (
                      <SelectItem key={service.id} value={service.category}>
                        {service.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
        )}
      </CardContent>
    </Card>
  );
};
