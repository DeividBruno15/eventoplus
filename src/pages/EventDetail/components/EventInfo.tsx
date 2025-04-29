
import { Event } from '@/types/events';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface EventInfoProps {
  event: Event;
}

export const EventInfo = ({ event }: EventInfoProps) => {
  const formattedDate = useMemo(() => {
    try {
      if (!event.event_date) return '';
      const date = new Date(event.event_date);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      console.error('Error formatting date:', error);
      return event.event_date?.toString() || '';
    }
  }, [event.event_date]);
  
  const getContractorInitials = () => {
    if (!event.contractor) return 'U';
    
    const { first_name, last_name } = event.contractor;
    return `${first_name?.charAt(0) || ''}${last_name ? last_name.charAt(0) : ''}`.toUpperCase() || 'U';
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{event.name}</h1>
      
      <div className="flex items-center gap-2">
        <Link to={`/profile/${event.contractor_id}`} className="flex items-center hover:underline">
          <Avatar className="h-8 w-8 mr-2">
            {event.contractor?.avatar_url ? (
              <AvatarImage src={event.contractor.avatar_url} alt={event.contractor?.first_name || 'U'} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getContractorInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium text-gray-600">
            Organizado por: {event.contractor ? `${event.contractor.first_name} ${event.contractor.last_name || ''}` : 'Usuário'}
          </span>
        </Link>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Data do evento:</p>
        <p className="text-base">{formattedDate} {event.event_time && `às ${event.event_time}`}</p>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Local:</p>
        <p className="text-base">{event.location}</p>
        {event.zipcode && (
          <p className="text-sm text-gray-500">
            {event.street && `${event.street}, `}
            {event.number && `${event.number}, `}
            {event.neighborhood && `${event.neighborhood}, `}
            {event.city && `${event.city}, `}
            {event.state && `${event.state}, `}
            {`CEP ${event.zipcode}`}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Descrição:</p>
        <p className="text-base whitespace-pre-line">{event.description}</p>
      </div>
      
      {event.service_requests && event.service_requests.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Serviços necessários:</p>
          <div className="grid gap-2">
            {event.service_requests.map((service, index) => (
              <div key={index} className="flex justify-between p-2 border rounded-md">
                <span>{service.category}</span>
                <div className="text-sm text-gray-600">
                  <span>{service.filled || 0}/{service.count} preenchidos</span>
                  {service.price && <span className="ml-2">• R$ {service.price}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
