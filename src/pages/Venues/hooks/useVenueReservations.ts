
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";

interface Reservation {
  id: string;
  venue_id: string;
  user_id: string;
  reservation_date: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'canceled';
  created_at: string;
  payment_id?: string;
}

export const useVenueReservations = (venueId: string) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Buscar todas as reservas do local
  const fetchReservations = async () => {
    if (!venueId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('venue_reservations')
        .select('*')
        .eq('venue_id', venueId)
        .eq('status', 'confirmed');
        
      if (error) throw error;
      
      setReservations(data as Reservation[]);
      
      // Converter datas string para objetos Date
      const dates = data.map(r => new Date(r.reservation_date));
      setBookedDates(dates);
      
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      toast.error('Não foi possível carregar as reservas');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Buscar apenas as reservas do usuário atual
  const fetchUserReservations = async () => {
    if (!venueId || !user) return [];
    
    try {
      const { data, error } = await supabase
        .from('venue_reservations')
        .select('*')
        .eq('venue_id', venueId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      return data as Reservation[];
      
    } catch (error) {
      console.error('Erro ao buscar reservas do usuário:', error);
      return [];
    }
  };
  
  // Verificar se uma data está disponível
  const isDateAvailable = (date: Date): boolean => {
    return !bookedDates.some(bookedDate => 
      bookedDate.getFullYear() === date.getFullYear() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getDate() === date.getDate()
    );
  };
  
  // Criar nova reserva
  const createReservation = async (date: Date, paymentId?: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer uma reserva');
      return null;
    }
    
    const formattedDate = date.toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('venue_reservations')
        .insert({
          venue_id: venueId,
          user_id: user.id,
          reservation_date: formattedDate,
          status: paymentId ? 'confirmed' : 'pending',
          payment_id: paymentId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Atualizar o estado local se bem-sucedido
      await fetchReservations();
      
      toast.success('Reserva criada com sucesso!');
      return data;
      
    } catch (error: any) {
      console.error('Erro ao criar reserva:', error);
      toast.error('Erro ao criar reserva: ' + (error.message || 'Tente novamente mais tarde'));
      return null;
    }
  };
  
  // Cancelar reserva
  const cancelReservation = async (reservationId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('venue_reservations')
        .update({ status: 'canceled' })
        .eq('id', reservationId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Atualizar o estado local
      await fetchReservations();
      
      toast.success('Reserva cancelada com sucesso');
      return true;
      
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      toast.error('Erro ao cancelar a reserva');
      return false;
    }
  };
  
  return {
    reservations,
    bookedDates,
    isLoading,
    fetchReservations,
    fetchUserReservations,
    isDateAvailable,
    createReservation,
    cancelReservation
  };
};
