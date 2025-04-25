
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/types/events";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

  // Create an image placeholder for events
  const eventImageUrl = event.image_url || "https://plus.unsplash.com/premium_photo-1681582960531-73493d0a95a5?q=80&w=1470&auto=format&fit=crop";
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
      <div className="relative h-44">
        <img 
          src={eventImageUrl}
          alt={event.name}
          className="object-cover w-full h-full"
        />
        <Badge 
          className="absolute top-3 right-3"
          variant={getStatusBadgeVariant(event.status)}
        >
          {getStatusLabel(event.status)}
        </Badge>
      </div>
      
      <CardHeader className="pb-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{event.name}</h3>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {event.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.service_type}
        </p>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3 flex-shrink-0" />
            <span className="truncate">{formatDate(event.event_date)}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
            <span className="truncate">{getEventTime()}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="mr-1 h-3 w-3 flex-shrink-0" />
            <span className="truncate">{event.max_attendees || 'Ilimitado'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="mt-auto pt-2">
        <Button 
          variant="default" 
          className="w-full" 
          onClick={() => navigate(`/events/${event.id}`)}
          size="sm"
        >
          Ver detalhes
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
