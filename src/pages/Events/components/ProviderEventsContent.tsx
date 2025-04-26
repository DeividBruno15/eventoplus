
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, DollarSign, Users, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProviderEventsContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ProviderEventsContent: React.FC<ProviderEventsContentProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  // Mock data for provider events
  const upcomingEvents = [
    { 
      id: 1, 
      title: "Casamento no Jardim", 
      date: "10 de Maio, 2025", 
      location: "São Paulo, SP", 
      budget: "R$ 3.500 - R$ 5.000",
      attendees: 150,
      type: "Casamento",
      services: ["Buffet", "Decoração"],
      status: "confirmado" 
    },
    { 
      id: 2, 
      title: "Conferência Empresarial", 
      date: "22 de Maio, 2025", 
      location: "Rio de Janeiro, RJ", 
      budget: "R$ 8.000 - R$ 12.000",
      attendees: 200,
      type: "Corporativo",
      services: ["Buffet", "Fotografia"],
      status: "pendente" 
    }
  ];

  const availableEvents = [
    { 
      id: 3, 
      title: "Aniversário de 15 anos", 
      date: "17 de Junho, 2025", 
      location: "Belo Horizonte, MG", 
      budget: "R$ 2.000 - R$ 4.000",
      attendees: 80,
      type: "Aniversário",
      services: ["Buffet", "Decoração", "Fotografia"],
      status: "disponível" 
    },
    { 
      id: 4, 
      title: "Workshop de Marketing", 
      date: "5 de Julho, 2025", 
      location: "São Paulo, SP", 
      budget: "R$ 5.000 - R$ 7.000",
      attendees: 120,
      type: "Corporativo",
      services: ["Buffet", "Equipamentos"],
      status: "disponível" 
    },
    { 
      id: 5, 
      title: "Casamento na Praia", 
      date: "12 de Agosto, 2025", 
      location: "Florianópolis, SC", 
      budget: "R$ 10.000 - R$ 15.000",
      attendees: 180,
      type: "Casamento",
      services: ["Buffet", "Decoração", "Fotografia", "DJ"],
      status: "disponível" 
    }
  ];

  const filteredUpcomingEvents = upcomingEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableEvents = availableEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEventCard = (event: any) => (
    <Card key={event.id} className="mb-4">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">{event.title}</h3>
            <p className="text-muted-foreground text-sm">{event.type}</p>
          </div>
          <Badge variant={
            event.status === 'confirmado' ? 'default' :
            event.status === 'pendente' ? 'secondary' : 'outline'
          } className="mt-2 md:mt-0">
            {event.status === 'confirmado' ? 'Confirmado' :
             event.status === 'pendente' ? 'Pendente' : 'Disponível'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{event.attendees} convidados</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>Orçamento: {event.budget}</span>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Serviços necessários:</p>
          <div className="flex flex-wrap gap-2">
            {event.services.map((service: string, index: number) => (
              <Badge key={index} variant="outline">
                {service}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          {event.status === 'disponível' ? (
            <Button>Enviar Orçamento</Button>
          ) : event.status === 'pendente' ? (
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="h-4 w-4" />
              Aguardando aprovação
            </div>
          ) : (
            <Button variant="outline">Ver Detalhes</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
        <p className="text-muted-foreground mt-2">
          Visualize e envie orçamentos para eventos que precisam dos seus serviços.
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

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Disponíveis para Orçamento</TabsTrigger>
          <TabsTrigger value="upcoming">Meus Eventos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-4">
          {filteredAvailableEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40 text-center p-6">
                <h3 className="text-lg font-medium mb-2">Nenhum evento disponível</h3>
                <p className="text-muted-foreground text-sm">
                  Não há eventos disponíveis para orçamento com os critérios de busca atuais.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAvailableEvents.map(renderEventCard)
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          {filteredUpcomingEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40 text-center p-6">
                <h3 className="text-lg font-medium mb-2">Nenhum evento agendado</h3>
                <p className="text-muted-foreground text-sm">
                  Você ainda não possui eventos agendados ou confirmados.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredUpcomingEvents.map(renderEventCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
