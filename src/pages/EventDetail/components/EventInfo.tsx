
import { Event } from '@/types/events';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { getStatusColor } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventInfoProps {
  event: Event;
}

export const EventInfo = ({ event }: EventInfoProps) => {
  return (
    <div className="lg:col-span-2">
      <div className="mb-2 flex items-center">
        <Badge 
          variant="outline" 
          className={`${getStatusColor(event.status)} text-white`}
        >
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Badge>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
      {event.creator && (
        <p className="text-gray-600 mb-6">
          Organizado por {event.creator.first_name} {event.creator.last_name}
        </p>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-3 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Data do Evento</p>
              <p className="font-medium">
                {format(new Date(event.event_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-3 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p className="font-medium">
                {new Date(event.event_date).toLocaleTimeString('pt-BR')} horas
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-3 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Local</p>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-3 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Convidados</p>
              <p className="font-medium">{event.max_attendees || "Não especificado"}</p>
            </div>
          </div>
        </div>
        
        <h3 className="font-medium text-lg mb-2">Descrição</h3>
        <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
        
        <h3 className="font-medium text-lg mt-6 mb-2">Tipo de Evento</h3>
        <p className="text-gray-700">{event.service_type}</p>
      </div>
    </div>
  );
};
