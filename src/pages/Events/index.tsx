
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CalendarIcon, MapPin, Users, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  service_type: string;
  max_attendees: number;
  contractor_id: string;
  status: string;
  created_at: string;
  contractor: {
    first_name: string;
    last_name: string;
  };
}

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
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

    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            contractor:user_profiles!contractor_id(first_name, last_name)
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
    fetchEvents();
  }, [user, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500';
      case 'closed':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Eventos Disponíveis</h1>
            <p className="text-gray-600">Encontre e candidate-se a eventos na sua região</p>
          </div>
          {userRole === 'contractor' && (
            <Button as={Link} to="/events/create">
              <Plus className="mr-2 h-4 w-4" /> Criar Evento
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <h3 className="text-xl font-medium mb-2">Nenhum evento encontrado</h3>
              <p className="text-muted-foreground mb-6">
                {userRole === 'contractor' 
                  ? 'Crie seu primeiro evento para encontrar prestadores de serviço!' 
                  : 'No momento não há eventos disponíveis para se candidatar.'}
              </p>
              {userRole === 'contractor' && (
                <Button as={Link} to="/events/create">
                  <Plus className="mr-2 h-4 w-4" /> Criar Evento
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{event.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(event.status)} text-white`}
                    >
                      {event.status === 'open' ? 'Aberto' : 
                       event.status === 'closed' ? 'Fechado' : 
                       event.status === 'in_progress' ? 'Em Andamento' : 'Desconhecido'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Por {event.contractor.first_name} {event.contractor.last_name} • 
                    {formatDistanceToNow(new Date(event.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {new Date(event.event_date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Users className="h-4 w-4 mr-2" />
                    {event.max_attendees || "Não especificado"} convidados
                  </div>
                  <p className="text-sm line-clamp-2">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    as={Link} 
                    to={`/events/${event.id}`} 
                    className="w-full"
                    variant={userRole === 'provider' ? "default" : "outline"}
                  >
                    {userRole === 'provider' ? 'Candidatar-se' : 'Ver Detalhes'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Events;
