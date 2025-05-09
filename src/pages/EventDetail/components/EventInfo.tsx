
import { Event } from '@/types/events';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface EventInfoProps {
  event: Event;
}

export const EventInfo = ({ event }: EventInfoProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Format the date for display
  const formattedDate = (() => {
    try {
      if (!event.event_date) return 'Data não definida';
      return format(new Date(event.event_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Data inválida';
    }
  })();

  // Handle image loading and errors
  useEffect(() => {
    if (event.image_url) {
      const img = new Image();
      img.onload = () => {
        console.log(`Image loaded successfully: ${event.image_url}`);
        setImageUrl(event.image_url);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${event.image_url}`);
        setImageUrl(null);
      };
      img.src = event.image_url;
    } else {
      setImageUrl(null);
    }
  }, [event.image_url]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event image */}
        <div className="flex justify-center md:justify-start">
          <div className="bg-gray-100 h-60 w-full max-w-md rounded-lg overflow-hidden relative">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={event.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Calendar className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Event details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{event.name}</h1>
          
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span>{formattedDate}</span>
              </div>
              
              {event.event_time && (
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span>{event.event_time}</span>
                </div>
              )}
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span>{event.service_type || 'Serviço não especificado'}</span>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Descrição</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
