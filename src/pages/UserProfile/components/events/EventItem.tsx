
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '../../types';

interface EventItemProps {
  event: Event;
}

export const EventItem = ({ event }: EventItemProps) => {
  return (
    <Link to={`/events/${event.id}`} key={event.id}>
      <Card className="hover:bg-gray-50 transition-colors">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
              {event.image_url ? (
                <img 
                  src={event.image_url} 
                  alt={event.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium">{event.name}</h4>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{format(new Date(event.event_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
