
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/types/events";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get status badge class based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'finished':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="bg-primary/10 p-6 flex items-center justify-center md:w-24">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <CardContent className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">{event.name}</h3>
              <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground mt-2 gap-y-1 gap-x-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(event.event_date)}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {event.max_attendees || 'Ilimitado'} participantes
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
  );
};
