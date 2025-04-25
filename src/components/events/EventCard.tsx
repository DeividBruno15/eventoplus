
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  participants: number;
  status: string;
}

interface EventCardProps {
  event: Event;
  formatDate: (date: string) => string;
  getStatusBadgeClass: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const EventCard = ({ 
  event, 
  formatDate, 
  getStatusBadgeClass, 
  getStatusLabel 
}: EventCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="bg-primary/10 p-6 flex items-center justify-center md:w-24">
          <Calendar className="h-8 w-8 text-primary" />
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
  );
};
