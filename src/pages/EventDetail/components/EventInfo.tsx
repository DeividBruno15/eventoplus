
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Clock, User, Building } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '@/types/events';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface EventInfoProps {
  event: Event;
}

export const EventInfo = ({ event }: EventInfoProps) => {
  // Format the event date
  const eventDate = event.event_date
    ? format(new Date(event.event_date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : 'Data não definida';
    
  // Get contractor initials for avatar fallback
  const getContractorInitials = () => {
    if (!event.contractor) return 'C';
    const { first_name, last_name } = event.contractor;
    return `${first_name?.charAt(0) || ''}${last_name ? last_name.charAt(0) : ''}`.toUpperCase() || 'C';
  };
  
  const renderServiceRequests = () => {
    if (!event.service_requests || event.service_requests.length === 0) {
      return <p>Nenhum serviço solicitado</p>;
    }
    
    return (
      <ul className="mt-1 space-y-1">
        {event.service_requests.map((req, index) => (
          <li key={index} className="flex items-center justify-between">
            <span className="text-sm">{req.category}</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{req.filled || 0}/{req.count}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Event date and time */}
          <div className="flex items-start space-x-2">
            <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{eventDate}</p>
              {event.event_time && (
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">{event.event_time}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p>{event.location}</p>
          </div>
          
          {/* Contractor - Only show if there is contractor data */}
          {event.contractor && (
            <div className="flex items-start space-x-2">
              <User className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex items-center">
                <span className="mr-2">Organizado por:</span>
                <Link to={`/provider-profile/${event.contractor_id}`} className="flex items-center group">
                  <Avatar className="h-6 w-6 mr-2">
                    {event.contractor.avatar_url ? (
                      <AvatarImage 
                        src={event.contractor.avatar_url}
                        alt={`${event.contractor.first_name} ${event.contractor.last_name || ''}`}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getContractorInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="group-hover:text-primary transition-colors">
                    {event.contractor.first_name} {event.contractor.last_name || ''}
                  </span>
                </Link>
              </div>
            </div>
          )}
          
          {/* Attendees - Only show if max_attendees is defined */}
          {event.max_attendees && (
            <div className="flex items-start space-x-2">
              <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p>{event.max_attendees} convidados</p>
            </div>
          )}
          
          {/* Services requested */}
          <div>
            <h3 className="font-medium text-lg mt-6 mb-3">Serviços solicitados</h3>
            {renderServiceRequests()}
          </div>
          
          {/* Description */}
          <div>
            <h3 className="font-medium text-lg mt-6 mb-3">Descrição</h3>
            <p className="whitespace-pre-line">{event.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
