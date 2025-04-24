
import { Event } from "@/types/events";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  const statusColors = {
    draft: "bg-gray-500",
    published: "bg-green-500",
    cancelled: "bg-red-500",
    finished: "bg-blue-500"
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <Badge 
            variant="outline" 
            className={`${statusColors[event.status]} text-white`}
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDate(new Date(event.event_date))}
          <span className="mx-1">às</span>
          {event.event_time}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          {event.location}
        </div>
        {event.max_guests && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            {event.max_guests} convidados
          </div>
        )}
        <p className="text-sm line-clamp-2">{event.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/events/${event.id}`)}
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};
