
import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigateFunction } from "react-router-dom";

interface UpcomingEventsProps {
  navigate: NavigateFunction;
}

export const UpcomingEvents = ({ navigate }: UpcomingEventsProps) => {
  const upcomingEvents = [
    { id: 1, title: "Reunião de Equipe", date: "25 de Julho", location: "São Paulo, SP", status: "confirmado" },
    { id: 2, title: "Workshop de Marketing", date: "10 de Agosto", location: "Rio de Janeiro, RJ", status: "pendente" },
    { id: 3, title: "Conferência Anual", date: "15 de Setembro", location: "Belo Horizonte, MG", status: "planejamento" }
  ];

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-2xl">Próximos Eventos</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Eventos que você está organizando
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="flex items-center gap-2 md:gap-4 p-2 md:p-4 rounded-lg hover:bg-gray-50 transition-colors border">
            <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <h3 className="text-sm md:text-base font-medium text-gray-900 truncate">
                  {event.title}
                </h3>
                <Badge className="text-xs" variant={
                  event.status === 'confirmado' ? 'default' :
                  event.status === 'pendente' ? 'secondary' : 'outline'
                }>
                  {event.status === 'confirmado' ? 'Confirmado' :
                   event.status === 'pendente' ? 'Pendente' : 'Planejamento'}
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-gray-600">
                {event.date}
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                {event.location}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-xs md:text-sm" onClick={() => navigate("/events/create")}>
          Criar Novo Evento
        </Button>
      </CardFooter>
    </Card>
  );
};
