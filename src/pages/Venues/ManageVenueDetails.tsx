
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VenueHeader from './components/manage/VenueHeader';
import ReservationsTab from './components/manage/ReservationsTab';
import AvailabilityTab from './components/manage/AvailabilityTab';

interface Venue {
  id: string;
  title: string;
  description: string;
  venue_type: string;
  price_per_hour: number;
  image_url: string | null;
  created_at: string;
  views: number;
  user_id: string;
}

interface Reservation {
  id: string;
  user_id: string;
  venue_id: string;
  reservation_date: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'canceled';
  created_at: string;
  user_name?: string;
  user_email?: string;
  payment_id?: string;
}

const ManageVenueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (id) {
      fetchVenueDetails();
      fetchReservations();
    }
  }, [id, user]);

  const fetchVenueDetails = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('venue_announcements')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Verificar se o usuário é o proprietário
      if (data.user_id !== user?.id) {
        toast.error('Você não tem permissão para gerenciar este local');
        navigate('/venues/manage');
        return;
      }
      
      setVenue(data as Venue);
    } catch (error) {
      console.error('Erro ao buscar detalhes do local:', error);
      toast.error('Erro ao carregar informações do local');
      navigate('/venues/manage');
    }
  };

  const fetchReservations = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Buscar reservas
      const { data, error } = await supabase
        .from('venue_reservations')
        .select(`
          *,
          profiles:user_id (
            name:first_name,
            email
          )
        `)
        .eq('venue_id', id)
        .order('reservation_date', { ascending: false });
        
      if (error) throw error;
      
      // Formatar dados com informações do usuário
      const formattedReservations = data.map((reservation: any) => ({
        ...reservation,
        user_name: reservation.profiles?.name || 'Usuário',
        user_email: reservation.profiles?.email || '-',
      }));
      
      setReservations(formattedReservations);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      toast.error('Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  // Se não houver local ou o usuário não estiver autenticado
  if (!venue || !user) {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header com informações do local */}
      <VenueHeader 
        venueId={venue.id}
        title={venue.title}
        venueType={venue.venue_type}
        views={venue.views}
      />

      <Tabs defaultValue="reservations">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
          <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reservations" className="mt-6">
          <ReservationsTab
            venueId={venue.id}
            venue={venue}
            reservations={reservations}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="availability" className="mt-6">
          <AvailabilityTab venueId={venue.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageVenueDetails;
