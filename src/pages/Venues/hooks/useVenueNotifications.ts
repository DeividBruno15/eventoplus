
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

export const useVenueNotifications = (userId?: string) => {
  const { notifications, fetchNotifications, unreadCount } = useNotifications(userId);
  
  // Enviar notificação quando uma reserva é feita
  const sendReservationNotification = async (
    ownerId: string,
    venueId: string,
    venueName: string,
    userName: string,
    reservationDate: string
  ) => {
    try {
      if (!ownerId) return false;
      
      const formattedDate = new Date(reservationDate).toLocaleDateString('pt-BR');
      
      const { error } = await supabase.from('notifications').insert({
        user_id: ownerId,
        title: 'Nova solicitação de reserva',
        content: `${userName} solicitou uma reserva para "${venueName}" no dia ${formattedDate}`,
        type: 'reservation_request',
        link: `/venues/manage/${venueId}`
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação de reserva:', error);
      return false;
    }
  };
  
  // Enviar notificação quando uma reserva é aprovada ou rejeitada
  const sendReservationStatusNotification = async (
    userId: string,
    venueId: string,
    venueName: string,
    status: 'confirmed' | 'rejected' | 'canceled',
    reservationDate: string
  ) => {
    try {
      if (!userId) return false;
      
      const formattedDate = new Date(reservationDate).toLocaleDateString('pt-BR');
      let title: string;
      let content: string;
      
      switch (status) {
        case 'confirmed':
          title = 'Reserva confirmada';
          content = `Sua reserva para "${venueName}" no dia ${formattedDate} foi confirmada!`;
          break;
        case 'rejected':
          title = 'Reserva rejeitada';
          content = `Sua reserva para "${venueName}" no dia ${formattedDate} foi rejeitada.`;
          break;
        case 'canceled':
          title = 'Reserva cancelada';
          content = `Sua reserva para "${venueName}" no dia ${formattedDate} foi cancelada.`;
          break;
        default:
          title = 'Atualização da reserva';
          content = `Houve uma mudança no status da sua reserva para "${venueName}" no dia ${formattedDate}.`;
      }
      
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        title,
        content,
        type: `reservation_${status}`,
        link: `/venues/details/${venueId}`
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação de status de reserva:', error);
      return false;
    }
  };
  
  // Enviar notificação quando um local recebe uma nova avaliação
  const sendNewRatingNotification = async (
    ownerId: string,
    venueId: string,
    venueName: string,
    rating: number,
    reviewerName: string
  ) => {
    try {
      if (!ownerId) return false;
      
      const { error } = await supabase.from('notifications').insert({
        user_id: ownerId,
        title: 'Nova avaliação recebida',
        content: `${reviewerName} avaliou "${venueName}" com ${rating} ${rating === 1 ? 'estrela' : 'estrelas'}`,
        type: 'venue_rating',
        link: `/venues/details/${venueId}#ratings`
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação de avaliação:', error);
      return false;
    }
  };
  
  // Enviar notificação quando o proprietário responde a uma avaliação
  const sendRatingResponseNotification = async (
    reviewerId: string,
    venueId: string,
    venueName: string,
    ownerName: string
  ) => {
    try {
      if (!reviewerId) return false;
      
      const { error } = await supabase.from('notifications').insert({
        user_id: reviewerId,
        title: 'Resposta à sua avaliação',
        content: `${ownerName} respondeu à sua avaliação de "${venueName}"`,
        type: 'rating_response',
        link: `/venues/details/${venueId}#ratings`
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação de resposta à avaliação:', error);
      return false;
    }
  };
  
  // Mostrar notificações toast para novos itens
  useEffect(() => {
    if (notifications.length > 0 && unreadCount > 0) {
      const unreadNotifications = notifications.filter(n => !n.read);
      
      // Mostrar apenas a notificação mais recente como toast
      if (unreadNotifications.length > 0) {
        const latestNotification = unreadNotifications[0];
        
        // Determinar o tipo de toast com base no tipo de notificação
        if (latestNotification.type?.includes('reservation_confirmed')) {
          toast.success(latestNotification.content, {
            description: latestNotification.title
          });
        } else if (latestNotification.type?.includes('reservation_rejected') || 
                   latestNotification.type?.includes('reservation_canceled')) {
          toast.error(latestNotification.content, {
            description: latestNotification.title
          });
        } else if (latestNotification.type?.includes('venue_rating')) {
          toast(latestNotification.content, {
            description: latestNotification.title,
            icon: "⭐"
          });
        } else {
          toast(latestNotification.content, {
            description: latestNotification.title
          });
        }
      }
    }
  }, [unreadCount, notifications]);
  
  return {
    sendReservationNotification,
    sendReservationStatusNotification,
    sendNewRatingNotification,
    sendRatingResponseNotification
  };
};
