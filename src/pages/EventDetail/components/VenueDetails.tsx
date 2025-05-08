
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building, MapPin, Users, CalendarClock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types/events';

interface VenueDetailsProps {
  event: Event;
}

interface VenueData {
  id: string;
  title: string;
  description: string;
  venue_type: string;
  max_capacity: number;
  price_per_day: number;
}

export const VenueDetails = ({ event }: VenueDetailsProps) => {
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenueData = async () => {
      if (!event.venue_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('venue_announcements')
          .select('id, title, description, venue_type, max_capacity, price_per_day')
          .eq('venue_id', event.venue_id)
          .single();

        if (error) {
          console.error('Error fetching venue:', error);
          setVenue(null);
        } else {
          setVenue(data);
        }
      } catch (err) {
        console.error('Error loading venue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [event.venue_id]);

  if (!event.venue_id || loading) {
    return null;
  }

  if (!venue) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Local do Evento</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg">{venue.title}</h3>
                  <p className="text-sm text-muted-foreground">{venue.venue_type}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">Capacidade para {venue.max_capacity} pessoas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CalendarClock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">
                    Valor diário: {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(venue.price_per_day)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/venues/${venue.id}`)}
              className="w-full sm:w-auto"
            >
              Ver detalhes do local
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
