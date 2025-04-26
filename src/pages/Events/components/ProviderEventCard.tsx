
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CheckCircle, Clock } from "lucide-react";
import { Event } from "@/types/events";
import { useNavigate } from "react-router-dom";

interface ProviderEventCardProps {
  event: Event;
  isApplied?: boolean;
  onApply: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
}

export const ProviderEventCard = ({
  event,
  isApplied = false,
  onApply,
  onViewDetails,
}: ProviderEventCardProps) => {
  const eventDate = event.event_date 
    ? new Date(event.event_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Data não definida';

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">{event.name}</h3>
            <p className="text-muted-foreground text-sm">{event.service_type}</p>
          </div>
          <Badge variant={
            isApplied ? event.status === 'published' ? 'secondary' : 'outline' : 'default'
          }>
            {isApplied ? event.status === 'published' ? 'Inscrito' : 'Pendente' : 'Disponível'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{event.location}</span>
          </div>
          {event.max_attendees && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{event.max_attendees} convidados</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm line-clamp-2 text-gray-600">
            {event.description}
          </p>
        </div>
        
        <div className="mt-6 flex justify-end">
          {!isApplied ? (
            <Button onClick={() => onApply(event.id)}>
              Enviar Candidatura
            </Button>
          ) : (
            <div className="flex gap-3">
              {event.status === 'published' ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Candidatura aprovada
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <Clock className="h-4 w-4" />
                  Aguardando aprovação
                </div>
              )}
              <Button variant="outline" onClick={() => onViewDetails(event.id)}>
                Ver Detalhes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
