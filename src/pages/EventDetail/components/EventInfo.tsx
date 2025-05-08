
import { Event } from '@/types/events';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin, Calendar, Clock, Users, Info } from 'lucide-react';
import { VenueDetails } from './VenueDetails';
import { VenueRules } from '@/pages/Venues/components/VenueRules';

interface EventInfoProps {
  event: Event;
}

export const EventInfo = ({ event }: EventInfoProps) => {
  // Format date
  const formattedDate = (() => {
    try {
      return format(new Date(event.event_date), "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data não disponível";
    }
  })();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>{formattedDate}</span>
          </div>
          
          {event.event_time && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span>{event.event_time}</span>
            </div>
          )}
          
          <div className="flex items-start space-x-2 text-gray-600">
            <MapPin className="h-5 w-5 mt-0.5" />
            <span>{event.location}</span>
          </div>
          
          {event.max_attendees && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span>{event.max_attendees} convidados esperados</span>
            </div>
          )}
          
          {event.service_requests && event.service_requests.length > 0 && (
            <div className="pt-2">
              <h3 className="font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Serviços Solicitados
              </h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                {event.service_requests.map((service, idx) => (
                  <li key={idx} className="ml-4 list-disc">
                    {service.service_type || service.category}{' '}
                    {service.count && service.count > 1 ? `(${service.count})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
        </div>
      </div>
      
      {event.venue_id && (
        <div className="mt-8">
          <VenueDetails event={event} />
        </div>
      )}
    </div>
  );
};
