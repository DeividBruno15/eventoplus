
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/events";
import { getEventStatusColor } from "@/lib/utils";

interface EventInfoProps {
  event: Event;
}

export const EventInfo = ({ event }: EventInfoProps) => {
  // Format date
  const formattedDate = event.event_date ? 
    format(new Date(event.event_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 
    "Data não definida";
  
  // Get the complete address if available
  const fullAddress = [
    event.street,
    event.number && `Nº ${event.number}`,
    event.neighborhood,
    event.city,
    event.state,
    event.zipcode && `CEP: ${event.zipcode}`
  ].filter(Boolean).join(", ");
  
  return (
    <div>
      {/* Event header with image */}
      {event.image_url && (
        <div className="w-full h-48 md:h-64 lg:h-80 overflow-hidden relative">
          <img 
            src={event.image_url} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <Badge 
              variant="outline"
              className={`mb-2 ${getEventStatusColor(event.status)} border-white/20 text-white`}
            >
              {event.status === 'draft' ? 'Rascunho' : 
               event.status === 'published' ? 'Publicado' : 
               event.status === 'closed' ? 'Fechado' :
               event.status === 'completed' ? 'Concluído' : 
               event.status === 'cancelled' ? 'Cancelado' : 'Desconhecido'}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold">{event.name}</h1>
          </div>
        </div>
      )}
      
      {/* Event content */}
      <div className="p-6">
        {!event.image_url && (
          <div className="mb-4">
            <Badge 
              variant="outline"
              className={`${getEventStatusColor(event.status)}`}
            >
              {event.status === 'draft' ? 'Rascunho' : 
               event.status === 'published' ? 'Publicado' : 
               event.status === 'closed' ? 'Fechado' :
               event.status === 'completed' ? 'Concluído' : 
               event.status === 'cancelled' ? 'Cancelado' : 'Desconhecido'}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">{event.name}</h1>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {formattedDate}
          </div>
          
          {event.event_time && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {event.event_time}
            </div>
          )}
          
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate max-w-md">
              {event.location}
              {fullAddress ? ` - ${fullAddress}` : ''}
            </span>
          </div>
        </div>
        
        <div className="my-6 whitespace-pre-line">
          <h2 className="text-lg font-medium mb-2">Descrição do evento</h2>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
        
        {/* Service Requests Section */}
        {event.service_requests && event.service_requests.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-medium mb-3">Serviços Necessários</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {event.service_requests.map((service, index) => (
                <div key={index} className="border rounded-md p-3 bg-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{service.category}</span>
                    <Badge variant={service.filled === service.count ? "success" : "outline"}>
                      {service.filled || 0}/{service.count} preenchido
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
