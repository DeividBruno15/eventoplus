
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/events';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  
  // Format event date for display
  const formattedDate = event.event_date
    ? format(new Date(event.event_date), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : 'Data não definida';
  
  const getStatusBadge = () => {
    switch(event.status) {
      case 'published':
        return <span className="absolute top-3 right-3 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Publicado</span>;
      case 'cancelled':
        return <span className="absolute top-3 right-3 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Cancelado</span>;
      default:
        return <span className="absolute top-3 right-3 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Rascunho</span>;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        {/* Image section */}
        <div className="h-40 bg-gray-100 relative overflow-hidden">
          {event.image_url ? (
            <img 
              src={event.image_url} 
              alt={event.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <Calendar className="h-10 w-10 text-gray-300" />
            </div>
          )}
          {getStatusBadge()}
        </div>
        
        <CardContent className="pt-4 pb-6">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.name}</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="flex-shrink-0 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="flex-shrink-0 h-4 w-4" />
              <span className="truncate">{event.location}</span>
            </div>
            
            {event.max_attendees && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="flex-shrink-0 h-4 w-4" />
                <span>{event.max_attendees} convidados</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
          
          <Button 
            onClick={() => navigate(`/events/${event.id}`)}
            className="w-full"
          >
            Ver detalhes
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};
