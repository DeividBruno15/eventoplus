
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CheckCircle, Clock, User, Building } from "lucide-react";
import { Event } from "@/types/events";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

interface ContractorInfo {
  id: string;
  name: string;
  company_name?: string;
}

interface ProviderEventCardProps {
  event: Event;
  isApplied?: boolean;
  onApply: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
  contractorInfo?: ContractorInfo;
}

export const ProviderEventCard = ({
  event,
  isApplied = false,
  onApply,
  onViewDetails,
  contractorInfo,
}: ProviderEventCardProps) => {
  const navigate = useNavigate();
  
  // Format event date for display
  const eventDate = event.event_date 
    ? format(new Date(event.event_date), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : 'Data não definida';

  console.log("Event contractor info:", contractorInfo);
  console.log("Event data in card:", event);

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
          <div className="absolute top-3 right-3">
            <Badge variant={
              isApplied ? 
                event.status === 'published' ? 'secondary' : 'outline' 
                : 'default'
            }>
              {isApplied ? 
                event.status === 'published' ? 'Inscrito' : 'Pendente' 
                : 'Disponível'}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-5">
          <h3 className="text-xl font-semibold mb-3 line-clamp-1">{event.name}</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
              <span>{eventDate}</span>
              {event.event_time && <span className="text-gray-500">às {event.event_time}</span>}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="truncate">{event.location}</span>
            </div>
            
            {contractorInfo && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {contractorInfo.company_name ? (
                  <Building className="h-4 w-4 flex-shrink-0 text-primary" />
                ) : (
                  <User className="h-4 w-4 flex-shrink-0 text-primary" />
                )}
                <Link 
                  to={`/provider-profile/${contractorInfo.id}`} 
                  className="hover:text-primary hover:underline transition-colors"
                >
                  {contractorInfo.company_name || contractorInfo.name}
                </Link>
              </div>
            )}
            
            {/* Show contractor info from event object if available */}
            {!contractorInfo && event.contractor && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4 flex-shrink-0 text-primary" />
                <Link 
                  to={`/provider-profile/${event.contractor_id}`} 
                  className="hover:text-primary hover:underline transition-colors"
                >
                  {event.contractor.first_name} {event.contractor.last_name}
                </Link>
              </div>
            )}
            
            {event.max_attendees && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>{event.max_attendees} convidados</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
          
          <div className="mt-2 flex justify-end gap-3">
            {!isApplied ? (
              <Button onClick={() => onApply(event.id)} className="w-full">
                Enviar Candidatura
              </Button>
            ) : (
              <>
                {event.status === 'published' ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Candidatura aprovada</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Aguardando aprovação</span>
                  </div>
                )}
                <Button variant="outline" onClick={() => onViewDetails(event.id)}>
                  Ver Detalhes
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
