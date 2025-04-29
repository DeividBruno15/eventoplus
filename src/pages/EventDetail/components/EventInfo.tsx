
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Event } from '@/types/events';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventInfoProps {
  event: Event;
}

export const EventInfo = ({ event }: EventInfoProps) => {
  const formattedDate = event.event_date 
    ? format(parseISO(event.event_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : 'Data não definida';
    
  const getInitials = (first: string = '', last: string = '') => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };
  
  // Use the contractor data directly from the event
  const contractor = event.contractor;
  
  return (
    <div>
      <div className={`relative h-48 md:h-64 bg-gray-200 ${event.image_url ? '' : 'flex items-center justify-center'}`}>
        {event.image_url ? (
          <img 
            src={event.image_url} 
            alt={event.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-lg text-gray-400">Imagem não disponível</div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {event.service_type || 'Serviço não especificado'}
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {event.status === 'draft' ? 'Rascunho' : 
                 event.status === 'published' ? 'Publicado' : 
                 event.status === 'closed' ? 'Fechado' : 
                 event.status === 'completed' ? 'Concluído' : 'Cancelado'}
              </Badge>
            </div>
          </div>
        </div>
        
        {contractor && (
          <div className="mb-6">
            <h3 className="text-sm text-muted-foreground mb-2">Organizado por:</h3>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                {contractor.avatar_url ? (
                  <AvatarImage src={contractor.avatar_url} alt={contractor.first_name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(contractor.first_name, contractor.last_name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">
                  {contractor.first_name} {contractor.last_name}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>{formattedDate}</span>
          </div>
          
          {event.event_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>{event.event_time}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          {event.max_attendees && (
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>{event.max_attendees} convidados</span>
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="font-medium mb-2">Descrição</h3>
          <p className="text-muted-foreground whitespace-pre-line">
            {event.description}
          </p>
        </div>
        
        {event.service_requests && event.service_requests.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="font-medium mb-2">Serviços Necessários</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.service_requests.map((service, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{service.category}</p>
                    <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                      <span>Necessários: {service.count}</span>
                      <span>
                        Confirmados: {service.filled || 0}/{service.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
