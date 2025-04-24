
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Event, EventApplication, EventStatus } from '@/types/events';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { EventInfo } from './components/EventInfo';
import { ApplicationForm } from './components/ApplicationForm';
import { ApplicationsList } from './components/ApplicationsList';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
        
        const safeGetCreator = () => {
          if (eventData?.creator && 
              typeof eventData.creator === 'object' && 
              !('code' in eventData.creator) &&
              !('message' in eventData.creator) &&
              !('details' in eventData.creator) &&
              !('hint' in eventData.creator)) {
            return {
              first_name: eventData.creator?.first_name ?? '',
              last_name: eventData.creator?.last_name ?? '',
              phone_number: eventData.creator?.phone_number ?? null
            };
          }
          return null;
        };
        
        const creatorData = safeGetCreator();
        
        const processedEvent: Event = {
          id: eventData.id,
          name: eventData.name,
          description: eventData.description,
          event_date: eventData.event_date,
          location: eventData.location,
          max_attendees: eventData.max_attendees,
          contractor_id: eventData.contractor_id,
          created_at: eventData.created_at,
          updated_at: eventData.updated_at || null,
          service_type: eventData.service_type,
          status: eventData.status as EventStatus,
          creator: creatorData
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
          
          const processedApplications: EventApplication[] = (applicationsData || []).map(app => {
            const safeGetProvider = () => {
              if (app?.provider && 
                  typeof app.provider === 'object' && 
                  !('code' in app.provider) &&
                  !('message' in app.provider) &&
                  !('details' in app.provider) &&
                  !('hint' in app.provider)) {
                return {
                  first_name: app.provider?.first_name ?? '',
                  last_name: app.provider?.last_name ?? ''
                };
              }
              return null;
            };
            
            const providerData = safeGetProvider();
            
            return {
              id: app.id,
              event_id: app.event_id,
              provider_id: app.provider_id,
              message: app.message,
              status: app.status as 'pending' | 'approved' | 'rejected',
              created_at: app.created_at,
              provider: providerData
            };
          });
          
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

  const handleApply = async (message: string) => {
    if (!user || !event) return;
    
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('event_applications')
        .insert({
          event_id: event.id,
          provider_id: user.id,
          message: message,
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

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !event ? (
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <EventInfo event={event} />
            
            <div className="lg:col-span-1">
              {userRole === 'provider' && 
               (event.status === 'open' || event.status === 'published') && (
                <ApplicationForm 
                  event={event}
                  onSubmit={handleApply}
                  userApplication={userApplication}
                  submitting={submitting}
                />
              )}
              
              {userRole === 'contractor' && 
               event.contractor_id === user?.id && (
                <ApplicationsList 
                  applications={applications}
                  onApprove={handleApproveApplication}
                  submitting={submitting}
                  eventStatus={event.status}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;
