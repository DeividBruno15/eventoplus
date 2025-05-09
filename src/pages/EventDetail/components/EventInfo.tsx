
import { Event } from "@/types/events";
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  ClockIcon,
  BuildingIcon
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EventInfoProps {
  event: Event;
}

export const EventInfo = ({ event }: EventInfoProps) => {
  const [venueName, setVenueName] = useState<string | null>(null);
  
  // Fetch venue name if venue_id is available
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
  
  // Format the date nicely
  const formattedDate = event.event_date 
    ? format(new Date(event.event_date), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : "Data não definida";
    
  return (
    <div className="p-6">
      {/* Event image */}
      {event.image_url && (
        <div className="mb-6 rounded-lg overflow-hidden h-64">
          <img 
            src={event.image_url} 
            alt={event.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Error loading event image:', e);
              // Fallback to hide the broken image
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Event details */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{event.description}</p>
      </div>
      
      {/* Event metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarIcon className="h-5 w-5" />
          <span>{formattedDate}</span>
        </div>
        
        {event.event_time && (
          <div className="flex items-center gap-2 text-gray-600">
            <ClockIcon className="h-5 w-5" />
            <span>{event.event_time}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-gray-600">
          <MapPinIcon className="h-5 w-5" />
          <span>{event.location}</span>
        </div>
        
        {venueName && (
          <div className="flex items-center gap-2 text-gray-600">
            <BuildingIcon className="h-5 w-5" />
            <span>{venueName}</span>
          </div>
        )}
        
        {event.max_attendees && (
          <div className="flex items-center gap-2 text-gray-600">
            <UsersIcon className="h-5 w-5" />
            <span>{event.max_attendees} convidados</span>
          </div>
        )}
      </div>
    </div>
  );
};
