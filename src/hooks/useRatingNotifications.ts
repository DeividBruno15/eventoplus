
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Função para enviar uma notificação quando um venue recebe uma avaliação
export async function sendVenueRatingNotification(
  ownerId: string,
  rating: number,
  venueTitle: string,
  reviewerName: string,
  venueId: string
) {
  try {
    // Criando o conteúdo da notificação
    const title = `Nova avaliação recebida`;
    const content = `${reviewerName} deu ${rating} ${rating === 1 ? 'estrela' : 'estrelas'} para "${venueTitle}"`;
    
    // Inserindo a notificação na tabela notifications
    const { error } = await supabase.from('notifications').insert({
      user_id: ownerId,
      title,
      content,
      type: 'venue_rating',
      link: `/venues/${venueId}`,
      read: false
    });
    
    if (error) {
      console.error('Erro ao enviar notificação de avaliação:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação de avaliação:', error);
    return false;
  }
}

// Hook para usar ao criar uma avaliação
export function useRatingNotifications() {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  const sendRatingNotification = async (
    ownerId: string,
    rating: number,
    venueTitle: string,
    reviewerName: string,
    venueId: string
  ) => {
    setIsSending(true);
    try {
      const result = await sendVenueRatingNotification(
        ownerId, 
        rating, 
        venueTitle,
        reviewerName,
        venueId
      );
      
      if (!result) {
        toast({
          title: "Erro ao enviar notificação",
          description: "Não foi possível notificar o proprietário, mas sua avaliação foi registrada.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    } finally {
      setIsSending(false);
    }
  };
  
  return {
    isSending,
    sendRatingNotification
  };
}
