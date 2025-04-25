
import { Event } from "@/types/events";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventInfoProps {
  event: Event;
}

export const EventInfo = ({ event }: EventInfoProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get status badge variant based on status
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'open':
        return 'default';
      case 'closed':
        return 'destructive';
      case 'in_progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Get human-readable status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'closed':
        return 'Fechado';
      case 'in_progress':
        return 'Em andamento';
      case 'cancelled':
        return 'Cancelado';
      case 'finished':
        return 'Finalizado';
      default:
        return status;
    }
  };

  // Extract time from date if available
  const getEventTime = () => {
    if (!event.event_date) return "Horário não definido";
    const date = new Date(event.event_date);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const eventImageUrl = event.image_url || "https://plus.unsplash.com/premium_photo-1681582960531-73493d0a95a5?q=80&w=1470&auto=format&fit=crop";

  return (
    <Card>
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={eventImageUrl} 
          alt={event.name}
          className="h-full w-full object-cover"
        />
        <Badge 
          className="absolute top-4 right-4"
          variant={getStatusBadgeVariant(event.status)}
        >
          {getStatusLabel(event.status)}
        </Badge>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl font-bold">{event.name}</CardTitle>
        </div>
        <div className="text-sm font-medium text-muted-foreground mt-1">
          {event.service_type}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p>{formatDate(event.event_date)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p>{getEventTime()}</p>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Cidade</p>
              <p>{event.location}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Convidados</p>
              <p>{event.max_attendees || 'Ilimitado'}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Descrição</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
