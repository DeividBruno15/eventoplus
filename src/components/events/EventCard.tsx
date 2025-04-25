
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, ArrowRight, Edit, Trash, ImageIcon } from "lucide-react";
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
  const eventImageUrl = event.image_url || "";

  const handleEditEvent = () => {
    // Navigate to edit event page
    navigate(`/events/${event.id}/edit`);
    setDetailsOpen(false);
  };

  const handleDeleteEvent = () => {
    // Implement deletion logic
    setTimeout(() => {
      toast({
        title: "Evento excluído",
        description: `O evento "${event.name}" foi excluído com sucesso.`,
      });
      setConfirmDeleteOpen(false);
      setDetailsOpen(false);
    }, 500);
  };

  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
    setDetailsOpen(false);
  };
  
  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col h-full bg-white">
        <div className="relative h-36">
          {eventImageUrl ? (
            <img 
              src={eventImageUrl}
              alt={event.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
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
          
          {event.service_type && (
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                {event.service_type}
              </Badge>
            </div>
          )}
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

      {/* Modal de detalhes do evento - design melhorado */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Lado esquerdo: Imagem e detalhes básicos */}
            <div className="md:w-2/5">
              <div className="relative aspect-video w-full">
                {eventImageUrl ? (
                  <img 
                    src={eventImageUrl} 
                    alt={event.name} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Clique para adicionar imagem</p>
                  </div>
                )}
                <Badge 
                  className="absolute top-4 right-4"
                  variant={getStatusBadgeVariant(event.status)}
                >
                  {getStatusLabel(event.status)}
                </Badge>
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  <h2 className="font-semibold text-xl">{event.name}</h2>
                  <div className="flex flex-wrap gap-1">
                    {event.service_type.split(',').map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Data</p>
                    <p className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> {formatDate(event.event_date)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Horário</p>
                    <p className="flex items-center gap-1 text-sm">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {getEventTime()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Local</p>
                    <p className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {event.location}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Capacidade</p>
                    <p className="flex items-center gap-1 text-sm">
                      <Users className="h-3.5 w-3.5 text-primary" /> 
                      {event.max_attendees ? `${event.max_attendees} pessoas` : 'Ilimitado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lado direito: Descrição e ações */}
            <div className="md:w-3/5 border-t md:border-t-0 md:border-l">
              <div className="p-6">
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-sm whitespace-pre-wrap mb-6">{event.description}</p>
                
                <div className="space-y-2">
                  <h3 className="font-semibold mb-2">Ações</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 w-full justify-center"
                      onClick={handleViewDetails}
                    >
                      <ArrowRight className="h-4 w-4" /> Ver página completa
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 w-full justify-center"
                      onClick={handleEditEvent}
                    >
                      <Edit className="h-4 w-4" /> Editar evento
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex items-center gap-2 w-full justify-center sm:col-span-2"
                      onClick={() => setConfirmDeleteOpen(true)}
                    >
                      <Trash className="h-4 w-4" /> Excluir evento
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="p-4 bg-muted/10">
                <DialogClose asChild>
                  <Button variant="outline">Fechar</Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </div>
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
