
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Search, Filter, MapPin, Users, Calendar as CalendarIcon } from "lucide-react";

const Events = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  if (!session) {
    navigate('/login');
    return null;
  }

  // Mock events data
  const upcomingEvents = [
    {
      id: 1,
      title: 'Conferência de Marketing Digital',
      date: '2025-05-15',
      location: 'São Paulo, SP',
      participants: 42,
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Workshop de Design Thinking',
      date: '2025-05-20',
      location: 'Rio de Janeiro, RJ',
      participants: 25,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Meetup de Desenvolvedores',
      date: '2025-05-25',
      location: 'Belo Horizonte, MG',
      participants: 35,
      status: 'confirmed'
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: 'Palestra sobre Inovação',
      date: '2025-04-10',
      location: 'Curitiba, PR',
      participants: 50,
      status: 'completed'
    },
    {
      id: 5,
      title: 'Curso de Gestão de Projetos',
      date: '2025-04-05',
      location: 'Brasília, DF',
      participants: 30,
      status: 'completed'
    }
  ];

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
          <p className="text-muted-foreground mt-2">
            Gerencie e visualize todos os seus eventos.
          </p>
        </div>
        <Button onClick={() => navigate('/events/create')}>
          <Plus className="mr-2 h-4 w-4" /> Criar Evento
        </Button>
      </div>
      
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Buscar eventos..." />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filtrar
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="past">Eventos Passados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          <div className="grid gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-primary/10 p-6 flex items-center justify-center md:w-24">
                    <CalendarIcon className="h-8 w-8 text-primary" />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground mt-2 gap-y-1 gap-x-4">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {event.participants} participantes
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/events/${event.id}`)}>
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="past" className="mt-4">
          <div className="grid gap-4">
            {pastEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-muted p-6 flex items-center justify-center md:w-24">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground mt-2 gap-y-1 gap-x-4">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {event.participants} participantes
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/events/${event.id}`)}>
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
