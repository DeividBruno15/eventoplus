
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
    { id: 1, title: "Reunião de Equipe", date: "25 de Julho, 2025", location: "São Paulo, SP", status: "confirmado" },
    { id: 2, title: "Workshop de Marketing", date: "10 de Agosto, 2025", location: "Rio de Janeiro, RJ", status: "pendente" },
    { id: 3, title: "Conferência Anual", date: "15 de Setembro, 2025", location: "Belo Horizonte, MG", status: "planejamento" }
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
        <CardDescription>
          Eventos que você está organizando
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border">
            <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 truncate">
                  {event.title}
                </h3>
                <Badge variant={
                  event.status === 'confirmado' ? 'default' :
                  event.status === 'pendente' ? 'secondary' : 'outline'
                }>
                  {event.status === 'confirmado' ? 'Confirmado' :
                   event.status === 'pendente' ? 'Pendente' : 'Planejamento'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {event.date}
              </p>
              <p className="text-sm text-gray-500">
                {event.location}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => navigate("/events/create")}>
          Criar Novo Evento
        </Button>
      </CardFooter>
    </Card>
  );
};
