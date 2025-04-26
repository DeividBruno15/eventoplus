
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types/events";
import { useServiceCategories } from "@/hooks/useServiceCategories";

interface ProviderEventsContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ProviderEventsContent: React.FC<ProviderEventsContentProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const navigate = useNavigate();
  const { session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [appliedEvents, setAppliedEvents] = useState<Event[]>([]);
  const [providerServices, setProviderServices] = useState<string[]>([]);
  const { data: serviceCategories } = useServiceCategories();
  
  // Fetch provider's service categories
  useEffect(() => {
    const fetchProviderServices = async () => {
      if (!session?.user) return;

      try {
        const { data, error } = await supabase
          .from('provider_services')
          .select('category')
          .eq('provider_id', session.user.id);

        if (error) throw error;
        
        if (data) {
          setProviderServices(data.map(item => item.category));
        }
      } catch (error) {
        console.error('Error fetching provider services:', error);
      }
    };

    fetchProviderServices();
  }, [session]);

  // Fetch available events matching provider services
  useEffect(() => {
    const fetchEvents = async () => {
      if (!providerServices.length) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch events with service types matching provider's services
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .in('service_type', providerServices)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch events the provider has already applied to
        const { data: applications, error: appError } = await supabase
          .from('event_applications')
          .select('event_id')
          .eq('provider_id', session?.user?.id);

        if (appError) throw appError;

        const appliedEventIds = applications?.map(app => app.event_id) || [];
        
        // Filter events into available and applied categories
        const available: Event[] = [];
        const applied: Event[] = [];
        
        events?.forEach(event => {
          if (appliedEventIds.includes(event.id)) {
            applied.push(event as Event);
          } else {
            available.push(event as Event);
          }
        });

        setAvailableEvents(available);
        setAppliedEvents(applied);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os eventos disponíveis.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchEvents();
    }
  }, [providerServices, session?.user, toast]);

  const handleApply = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleViewDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const filteredAvailableEvents = availableEvents.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAppliedEvents = appliedEvents.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEventCard = (event: Event, isApplied = false) => {
    const eventDate = event.event_date 
      ? new Date(event.event_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
      : 'Data não definida';

    return (
      <Card key={event.id} className="mb-4">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">{event.name}</h3>
              <p className="text-muted-foreground text-sm">{event.service_type}</p>
            </div>
            <Badge variant={
              isApplied ? event.status === 'published' ? 'secondary' : 'outline' : 'default'
            }>
              {isApplied ? event.status === 'published' ? 'Inscrito' : 'Pendente' : 'Disponível'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{event.location}</span>
            </div>
            {event.max_attendees && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{event.max_attendees} convidados</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <p className="text-sm line-clamp-2 text-gray-600">
              {event.description}
            </p>
          </div>
          
          <div className="mt-6 flex justify-end">
            {!isApplied ? (
              <Button onClick={() => handleApply(event.id)}>
                Enviar Candidatura
              </Button>
            ) : (
              <div className="flex gap-3">
                {event.status === 'published' ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Candidatura aprovada
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock className="h-4 w-4" />
                    Aguardando aprovação
                  </div>
                )}
                <Button variant="outline" onClick={() => handleViewDetails(event.id)}>
                  Ver Detalhes
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
        <p className="text-muted-foreground mt-2">
          Visualize e candidate-se para eventos que correspondem aos seus serviços.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar eventos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {providerServices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40 text-center p-6">
            <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
            <h3 className="text-lg font-medium mb-2">Adicione categorias de serviços ao seu perfil</h3>
            <p className="text-muted-foreground text-sm">
              Para ver eventos disponíveis, você precisa adicionar as categorias de serviços que oferece.
            </p>
            <Button className="mt-4" onClick={() => navigate('/profile')}>
              Atualizar Perfil
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">Disponíveis para Candidatura</TabsTrigger>
            <TabsTrigger value="applied">Minhas Candidaturas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </CardContent>
              </Card>
            ) : filteredAvailableEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40 text-center p-6">
                  <h3 className="text-lg font-medium mb-2">Nenhum evento disponível</h3>
                  <p className="text-muted-foreground text-sm">
                    No momento não há eventos disponíveis para os serviços que você oferece.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAvailableEvents.map(event => renderEventCard(event))
            )}
          </TabsContent>
          
          <TabsContent value="applied" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </CardContent>
              </Card>
            ) : filteredAppliedEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40 text-center p-6">
                  <h3 className="text-lg font-medium mb-2">Nenhuma candidatura enviada</h3>
                  <p className="text-muted-foreground text-sm">
                    Você ainda não se candidatou a nenhum evento.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAppliedEvents.map(event => renderEventCard(event, true))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
