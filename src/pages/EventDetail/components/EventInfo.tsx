
import { Event } from '@/types/events';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventInfoProps {
  event: Event;
  expanded?: boolean;
}

export const EventInfo = ({ event, expanded = false }: EventInfoProps) => {
  // Format event date for display
  const formattedDate = event.event_date
    ? format(new Date(event.event_date), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : 'Data não definida';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-5">{event.name}</h3>
        
        <div className="grid gap-4 mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">Data</p>
              <p className="text-gray-600">{formattedDate}</p>
            </div>
          </div>
          
          {event.event_time && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Horário</p>
                <p className="text-gray-600">{event.event_time}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">Local</p>
              <p className="text-gray-600">{event.location}</p>
              
              {expanded && (
                <div className="mt-2 text-sm text-gray-500">
                  {event.zipcode && <p>CEP: {event.zipcode}</p>}
                  {event.street && <p>Rua: {event.street || 'N/A'}</p>}
                  {event.number && <p>Número: {event.number || 'N/A'}</p>}
                  {event.neighborhood && <p>Bairro: {event.neighborhood || 'N/A'}</p>}
                  {event.city && <p>Cidade: {event.city || 'N/A'}</p>}
                  {event.state && <p>Estado: {event.state || 'N/A'}</p>}
                  {event.zipcode && <p>CEP: {event.zipcode}</p>}
                </div>
              )}
            </div>
          </div>
          
          {event.max_attendees && (
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Convidados</p>
                <p className="text-gray-600">{event.max_attendees}</p>
              </div>
            </div>
          )}
        </div>
        
        {expanded && (
          <>
            <h4 className="text-lg font-semibold mb-3">Descrição</h4>
            <p className="text-gray-600 whitespace-pre-wrap mb-6">{event.description}</p>
          </>
        )}

        <h4 className="text-lg font-semibold mb-3">Serviços Necessários</h4>
        <div className="space-y-3">
          {event.service_requests && event.service_requests.length > 0 ? (
            event.service_requests.map((service, index) => (
              <div key={index} className="border rounded-lg p-3">
                <h5 className="font-medium">{service.category || service.service_type}</h5>
                <div className="text-sm text-gray-600 mt-1">
                  {service.count !== undefined && (
                    <p>Quantidade: {service.filled || 0}/{service.count}</p>
                  )}
                  {service.price !== undefined && (
                    <p>Preço estimado: {formatCurrency(service.price || 0)}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhum serviço específico solicitado.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
