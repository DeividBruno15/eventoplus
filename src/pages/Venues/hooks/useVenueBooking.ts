
import { useState } from "react";
import { paymentsService } from "@/services/payments";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { useVenueNotifications } from "./useVenueNotifications";

export const useVenueBooking = (
  venueId: string,
  venueName: string,
  pricePerDay: number,
  selectedDates: Date[]
) => {
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useAuth();
  const { sendReservationNotification } = useVenueNotifications();

  const handleBooking = async () => {
    if (selectedDates.length === 0) {
      toast.error("Selecione pelo menos um dia para reservar");
      return;
    }

    try {
      setIsBooking(true);
      
      // Verificar primeiro se o local pertence ao usuário
      if (user) {
        const { data: venueData } = await supabase
          .from('venue_announcements')
          .select('user_id')
          .eq('id', venueId)
          .single();
          
        if (venueData?.user_id === user.id) {
          toast.error("Você não pode reservar seu próprio local");
          return;
        }
      }
      
      // Para cada data selecionada, criar uma reserva
      for (const date of selectedDates) {
        // Verificar se a data já está reservada
        const { data: existingReservation } = await supabase
          .from('venue_reservations')
          .select('id')
          .eq('venue_id', venueId)
          .eq('reservation_date', date.toISOString().split('T')[0])
          .eq('status', 'confirmed')
          .maybeSingle();
          
        if (existingReservation) {
          toast.error(`A data ${date.toLocaleDateString('pt-BR')} já está reservada`);
          continue;
        }
        
        // Criar a reserva com status pendente
        const { data: reservation, error } = await supabase
          .from('venue_reservations')
          .insert({
            venue_id: venueId,
            user_id: user?.id,
            reservation_date: date.toISOString().split('T')[0],
            status: 'pending'
          })
          .select()
          .single();
          
        if (error) {
          console.error('Erro ao criar reserva:', error);
          toast.error(`Erro ao criar reserva para ${date.toLocaleDateString('pt-BR')}`);
          continue;
        }
        
        // Enviar notificação para o proprietário
        if (user) {
          const { data: venueData } = await supabase
            .from('venue_announcements')
            .select('user_id')
            .eq('id', venueId)
            .single();
            
          if (venueData?.user_id) {
            await sendReservationNotification(
              venueData.user_id,
              venueId,
              venueName,
              `${user.user_metadata?.first_name || 'Usuário'}`,
              date.toISOString()
            );
          }
        }
      }
      
      // Calculate total amount in cents
      const totalAmount = Math.round(pricePerDay * 100) * selectedDates.length;
      
      // Redirecionar para a página de pagamento ou mostrar confirmação
      toast.success('Solicitação de reserva enviada com sucesso!', {
        description: 'O proprietário irá revisar e confirmar sua reserva em breve'
      });
      
      // Opcionalmente, redirecionar para página de pagamento
      // window.location.href = `/venues/payment-pending/${venueId}`;
      
      // Ou redirecionar para a página de detalhes
      window.location.href = `/venues/details/${venueId}`;
    } catch (error) {
      console.error("Error booking venue:", error);
      toast.error("Ocorreu um erro ao processar sua reserva");
    } finally {
      setIsBooking(false);
    }
  };

  return {
    handleBooking,
    isBooking
  };
};
