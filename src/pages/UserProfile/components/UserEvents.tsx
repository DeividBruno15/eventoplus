
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  name: string;
  description?: string;
  event_date: string;
  location: string;
  image_url?: string;
}

interface UserEventsProps {
  userId: string;
  userRole: 'contractor' | 'provider';
}

export const UserEvents = ({ userId, userRole }: UserEventsProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        if (userRole === 'contractor') {
          // Fetch events created by this contractor
          const { data, error } = await supabase
            .from('events')
            .select('id, name, description, event_date, location, image_url')
            .eq('contractor_id', userId)
            .order('event_date', { ascending: false })
            .limit(5);
            
          if (error) throw error;
          setEvents(data || []);
        } else {
          // For providers, fetch events where they have approved applications
          const { data, error } = await supabase
            .from('event_applications')
            .select(`
              id,
              events:event_id (
                id, name, description, event_date, location, image_url
              )
            `)
            .eq('provider_id', userId)
            .eq('status', 'accepted')
            .order('created_at', { ascending: false })
            .limit(5);
            
          if (error) throw error;
          
          // Extract the events from the nested structure
          const providerEvents = (data || [])
            .map(item => item.events)
            .filter(event => event); // Filter out any nulls
            
          setEvents(providerEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId, userRole]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-500">
          {userRole === 'contractor' ? 'Nenhum evento criado' : 'Nenhum serviço prestado'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {userRole === 'contractor' 
            ? 'Este usuário ainda não criou eventos' 
            : 'Este prestador ainda não prestou serviços'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">
        {userRole === 'contractor' ? 'Eventos Organizados' : 'Serviços Prestados'}
      </h3>
      
      {events.map(event => (
        <Link to={`/events/${event.id}`} key={event.id}>
          <Card className="hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                  {event.image_url ? (
                    <img 
                      src={event.image_url} 
                      alt={event.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium">{event.name}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(event.event_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
