import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Event, EventApplication, EventStatus } from '@/types/events';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Calendar, MapPin, Users, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getStatusColor, getApplicationStatusColor } from '@/lib/utils';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userHasApplied, setUserHasApplied] = useState(false);
  const [userApplication, setUserApplication] = useState<EventApplication | null>(null);

  const fetchData = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setUserRole(data.role);
      } catch (error) {
        console.error('Erro ao buscar função do usuário:', error);
      }
    };

    const fetchEventDetails = async () => {
      try {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select(`
            *,
            creator:user_profiles(first_name, last_name, phone_number)
          `)
          .eq('id', id)
          .single();
          
        if (eventError) throw eventError;
        
        const processedEvent: Event = {
          id: eventData.id,
          name: eventData.name,
          description: eventData.description,
          event_date: eventData.event_date,
          location: eventData.location,
          max_attendees: eventData.max_attendees,
          contractor_id: eventData.contractor_id,
          created_at: eventData.created_at,
          service_type: eventData.service_type,
          status: eventData.status as EventStatus,
          creator: eventData.creator ? {
            first_name: eventData.creator.first_name ?? '',
            last_name: eventData.creator.last_name ?? '',
            phone_number: eventData.creator.phone_number
          } : null
        };
        
        setEvent(processedEvent);

        if (eventData.contractor_id === user?.id) {
          const { data: applicationsData, error: applicationsError } = await supabase
            .from('event_applications')
            .select(`
              *,
              provider:user_profiles(first_name, last_name)
            `)
            .eq('event_id', id)
            .order('created_at', { ascending: false });
            
          if (applicationsError) throw applicationsError;
          
          const processedApplications: EventApplication[] = (applicationsData || []).map(app => ({
            id: app.id,
            event_id: app.event_id,
            provider_id: app.provider_id,
            message: app.message,
            status: app.status as 'pending' | 'approved' | 'rejected',
            created_at: app.created_at,
            provider: app.provider ? {
              first_name: app.provider.first_name ?? '',
              last_name: app.provider.last_name ?? ''
            } : null
          }));
          
          setApplications(processedApplications);
        } else {
          const { data: applicationData, error: applicationError } = await supabase
            .from('event_applications')
            .select('*')
            .eq('event_id', id)
            .eq('provider_id', user?.id)
            .maybeSingle();
            
          if (applicationError) throw applicationError;
          setUserHasApplied(!!applicationData);
          
          if (applicationData) {
            setUserApplication({
              id: applicationData.id,
              event_id: applicationData.event_id,
              provider_id: applicationData.provider_id,
              message: applicationData.message,
              status: applicationData.status as 'pending' | 'approved' | 'rejected',
              created_at: applicationData.created_at,
              provider: null
            });
          }
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do evento:', error);
        toast({
          title: "Erro ao carregar evento",
          description: "Não foi possível carregar os detalhes do evento",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
    fetchEventDetails();
  };

  useEffect(() => {
    fetchData();
  }, [id, user, navigate, toast]);

  const handleApply = async () => {
    if (!user || !event) return;
    
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('event_applications')
        .insert({
          event_id: event.id,
          provider_id: user.id,
          message: applicationMessage,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Candidatura enviada!",
        description: "O contratante foi notificado sobre seu interesse.",
      });
      
      setUserHasApplied(true);
      setUserApplication(data as EventApplication);

      await supabase
        .from('notifications')
        .insert({
          user_id: event.contractor_id,
          title: "Nova candidatura ao seu evento",
          content: `Você recebeu uma nova candidatura para o evento "${event.name}"`,
          type: "new_application",
          link: `/events/${event.id}`
        });
    } catch (error: any) {
      console.error('Erro ao enviar candidatura:', error);
      toast({
        title: "Erro ao enviar candidatura",
        description: error.message || 'Ocorreu um erro ao enviar sua candidatura',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveApplication = async (applicationId: string, providerId: string) => {
    if (!event) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);
        
      if (error) throw error;
      
      await supabase
        .from('event_applications')
        .update({ status: 'rejected' })
        .eq('event_id', event.id)
        .neq('id', applicationId);
      
      await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', event.id);
      
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          service_request_id: null
        })
        .select()
        .single();
      
      if (conversationError) throw conversationError;
      
      await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: user?.id },
          { conversation_id: conversation.id, user_id: providerId }
        ]);
      
      await supabase
        .from('notifications')
        .insert({
          user_id: providerId,
          title: "Parabéns! Você foi aprovado para um evento",
          content: `Sua candidatura para o evento "${event.name}" foi aprovada!`,
          type: "application_approved",
          link: `/events/${event.id}`
        });
      
      toast({
        title: "Candidatura aprovada!",
        description: "O prestador foi notificado e vocês já podem começar a conversar.",
      });
      
      fetchData();
      
    } catch (error: any) {
      console.error('Erro ao aprovar candidatura:', error);
      toast({
        title: "Erro ao aprovar candidatura",
        description: error.message || 'Ocorreu um erro ao aprovar a candidatura',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Card className="text-center py-16">
            <CardContent>
              <h3 className="text-xl font-medium mb-2">Evento não encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Este evento pode ter sido removido ou você não tem permissão para acessá-lo.
              </p>
              <Button onClick={() => navigate('/events')}>
                Voltar para eventos
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/events')} 
                className="mr-2 p-1 h-auto"
              >
                &larr;
              </Button>
              <Badge 
                variant="outline" 
                className={`${getStatusColor(event.status)} text-white`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
            {event.creator && (
              <p className="text-gray-600 mb-6">
                Organizado por {event.creator.first_name} {event.creator.last_name}
              </p>
            )}
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data do Evento</p>
                    <p className="font-medium">
                      {format(new Date(event.event_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Horário</p>
                    <p className="font-medium">
                      {new Date(event.event_date).toLocaleTimeString('pt-BR')} horas
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Local</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Convidados</p>
                    <p className="font-medium">{event.max_attendees || "Não especificado"}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium text-lg mb-2">Descrição</h3>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
              
              <h3 className="font-medium text-lg mt-6 mb-2">Tipo de Evento</h3>
              <p className="text-gray-700">{event.service_type}</p>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {userRole === 'provider' && (event.status === 'open' || event.status === 'published') && !userHasApplied && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-medium text-lg mb-3">Candidatar-se a este evento</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explique por que você é a pessoa ideal para este serviço.
                  </p>
                  
                  <Textarea
                    placeholder="Descreva sua experiência e por que você é uma boa escolha para este evento..."
                    className="mb-4"
                    rows={4}
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                  />
                  
                  <Button 
                    className="w-full" 
                    onClick={handleApply}
                    disabled={submitting || !applicationMessage.trim()}
                  >
                    {submitting ? 
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </> : 
                      'Enviar candidatura'
                    }
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {userRole === 'provider' && userHasApplied && userApplication && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-lg">Sua candidatura</h3>
                    <Badge 
                      variant="outline" 
                      className={`${getApplicationStatusColor(userApplication.status)} text-white`}
                    >
                      {userApplication.status === 'pending' ? 'Pendente' : 
                       userApplication.status === 'approved' ? 'Aprovada' : 
                       userApplication.status === 'rejected' ? 'Rejeitada' : 'Desconhecido'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm whitespace-pre-line border-l-2 pl-4 py-1 border-primary/50 bg-primary/5 italic mb-4">
                    {userApplication.message}
                  </p>
                  
                  {userApplication.status === 'approved' && (
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
            )}
            
            {userRole === 'contractor' && event.contractor_id === user?.id && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-lg mb-4">Candidaturas</h3>
                  
                  {applications.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6">
                      Ainda não há candidaturas para este evento
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app.id} className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <User className="h-5 w-5 mr-2 text-primary" />
                              <span className="font-medium">
                                {app.provider ? `${app.provider.first_name} ${app.provider.last_name}` : 'Usuário'}
                              </span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`${getApplicationStatusColor(app.status)} text-white`}
                            >
                              {app.status === 'pending' ? 'Pendente' : 
                               app.status === 'approved' ? 'Aprovada' : 
                               app.status === 'rejected' ? 'Rejeitada' : 'Desconhecido'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm whitespace-pre-line border-l-2 pl-3 py-1 border-gray-200 bg-gray-50 mb-3">
                            {app.message}
                          </p>
                          
                          {app.status === 'pending' && (event.status === 'open' || event.status === 'published') && (
                            <Button 
                              onClick={() => handleApproveApplication(app.id, app.provider_id)}
                              disabled={submitting}
                              className="w-full"
                            >
                              {submitting ? 
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Aprovando...
                                </> : 
                                'Aprovar Prestador'
                              }
                            </Button>
                          )}
                          
                          {app.status === 'approved' && (
                            <Button 
                              onClick={() => navigate('/chat')}
                              className="w-full"
                            >
                              Conversar com o prestador
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;
