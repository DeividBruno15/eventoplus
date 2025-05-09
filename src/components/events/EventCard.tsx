
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/events';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const [venueName, setVenueName] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVenueName = async () => {
      if (!event.venue_id) return;
      
      try {
        const { data, error } = await supabase
          .from('venue_announcements')
          .select('title')
          .eq('venue_id', event.venue_id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setVenueName(data.title);
        }
      } catch (err) {
        console.error('Error fetching venue name:', err);
      }
    };
    
    fetchVenueName();
  }, [event.venue_id]);
  
  // Handle image loading and errors
  useEffect(() => {
    if (event.image_url) {
      console.log(`EventCard: Loading image for event ${event.id}: ${event.image_url}`);
      const img = new Image();
      img.onload = () => {
        console.log(`EventCard: Image loaded successfully for event ${event.id}`);
        setImageUrl(event.image_url);
      };
      img.onerror = () => {
        console.error(`EventCard: Failed to load image for event ${event.id}: ${event.image_url}`);
        setImageUrl(null);
      };
      img.src = event.image_url;
    } else {
      setImageUrl(null);
    }
  }, [event.image_url, event.id]);
  
  // Format event date for display - safely handle date formatting
  const formattedDate = event.event_date
    ? (() => {
        try {
          return format(new Date(event.event_date), "dd 'de' MMMM, yyyy", { locale: ptBR });
        } catch (e) {
          console.error("Error formatting date:", e, event.event_date);
          return 'Data não definida';
        }
      })()
    : 'Data não definida';
  
  const getStatusBadge = () => {
    switch(event.status) {
      case 'published':
        return <span className="absolute top-3 right-3 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Publicado</span>;
      case 'closed':
        return <span className="absolute top-3 right-3 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Fechado</span>;
      case 'draft':
        return <span className="absolute top-3 right-3 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Rascunho</span>;
      case 'open':
        return <span className="absolute top-3 right-3 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">Aberto</span>;
      case 'cancelled':
        return <span className="absolute top-3 right-3 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Cancelado</span>;
      default:
        return <span className="absolute top-3 right-3 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{event.status || 'Desconhecido'}</span>;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        {/* Image section */}
        <div className="h-40 bg-gray-100 relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={event.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <Calendar className="h-10 w-10 text-gray-300" />
            </div>
          )}
          {getStatusBadge()}
        </div>
        
        <CardContent className="pt-4 pb-6">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.name}</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="flex-shrink-0 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="flex-shrink-0 h-4 w-4" />
              <span className="truncate">{event.location}</span>
            </div>
            
            {venueName && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="flex-shrink-0 h-4 w-4" />
                <span className="truncate">{venueName}</span>
              </div>
            )}
            
            {event.max_attendees && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="flex-shrink-0 h-4 w-4" />
                <span>{event.max_attendees} convidados</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
          
          <Button 
            onClick={() => navigate(`/events/${event.id}`)}
            className="w-full"
          >
            Ver detalhes
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};
