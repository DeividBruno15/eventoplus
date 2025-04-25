
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, ArrowRight, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/types/events";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get status badge variant based on status
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'open':
        return 'default';
      case 'closed':
        return 'destructive';
      case 'in_progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Get human-readable status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'closed':
        return 'Fechado';
      case 'in_progress':
        return 'Em andamento';
      case 'cancelled':
        return 'Cancelado';
      case 'finished':
        return 'Finalizado';
      case 'published':
        return 'Publicado';
      default:
        return status;
    }
  };

  // Extract time from date if available
  const getEventTime = () => {
    if (!event.event_date) return "Horário não definido";
    const date = new Date(event.event_date);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Create an image placeholder for events with no image
  const eventImageUrl = event.image_url || "https://plus.unsplash.com/premium_photo-1681582960531-73493d0a95a5?q=80&w=1470&auto=format&fit=crop";

  const handleEditEvent = () => {
    // Aqui você implementaria a navegação para edição do evento
    navigate(`/events/${event.id}/edit`);
    setDetailsOpen(false);
  };

  const handleDeleteEvent = () => {
    // Aqui você implementaria a lógica de exclusão do evento
    toast({
      title: "Evento excluído",
      description: `O evento "${event.name}" foi excluído com sucesso.`,
    });
    setConfirmDeleteOpen(false);
    setDetailsOpen(false);
  };
  
  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col h-full bg-white">
        <div className="relative h-36">
          <img 
            src={eventImageUrl}
            alt={event.name}
            className="object-cover w-full h-full"
          />
          <Badge 
            className="absolute top-3 right-3"
            variant={getStatusBadgeVariant(event.status)}
          >
            {getStatusLabel(event.status)}
          </Badge>
        </div>
        
        <CardHeader className="p-4 pb-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-base line-clamp-1">{event.name}</h3>
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {event.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {event.service_type}
          </p>
        </CardHeader>
        
        <CardContent className="p-4 pb-2 pt-0">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center text-xs text-muted-foreground gap-2">
              <div className="bg-gray-100 p-1 rounded-full">
                <Calendar className="h-3 w-3 flex-shrink-0" />
              </div>
              <span className="truncate">{formatDate(event.event_date)}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground gap-2">
              <div className="bg-gray-100 p-1 rounded-full">
                <Clock className="h-3 w-3 flex-shrink-0" />
              </div>
              <span className="truncate">{getEventTime()}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground gap-2">
              <div className="bg-gray-100 p-1 rounded-full">
                <MapPin className="h-3 w-3 flex-shrink-0" />
              </div>
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground gap-2">
              <div className="bg-gray-100 p-1 rounded-full">
                <Users className="h-3 w-3 flex-shrink-0" />
              </div>
              <span className="truncate">
                {event.max_attendees ? `${event.max_attendees} convidados` : 'Ilimitado'}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="mt-auto p-4 pt-2">
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => setDetailsOpen(true)}
            size="sm"
          >
            Ver detalhes
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>

      {/* Modal de detalhes do evento */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{event.name}</span>
              <Badge variant={getStatusBadgeVariant(event.status)}>
                {getStatusLabel(event.status)}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="rounded-md overflow-hidden aspect-video mb-4">
                <img 
                  src={eventImageUrl} 
                  alt={event.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Data</h4>
                  <p className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" /> {formatDate(event.event_date)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Horário</h4>
                  <p className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" /> {getEventTime()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Local</h4>
                  <p className="flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4" /> {event.location}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Convidados</h4>
                  <p className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4" /> 
                    {event.max_attendees ? `${event.max_attendees} pessoas` : 'Ilimitado'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Tipo de Serviço</h4>
                <p className="text-sm">{event.service_type}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h4>
                <p className="text-sm whitespace-pre-wrap">{event.description}</p>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Ações</h4>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <ArrowRight className="h-4 w-4" /> Ver página completa
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={handleEditEvent}
                  >
                    <Edit className="h-4 w-4" /> Editar evento
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    className="flex items-center gap-1"
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    <Trash className="h-4 w-4" /> Excluir evento
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de confirmação de exclusão */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o evento "{event.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Excluir evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
