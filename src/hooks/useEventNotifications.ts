import { supabase } from '@/integrations/supabase/client';

// Função para enviar notificação quando um usuário recebe uma avaliação
export async function sendRatingNotification(
  userId: string, 
  rating: number, 
  reviewerName: string
) {
  try {
    const title = `Nova avaliação recebida`;
    const content = `${reviewerName} deu ${rating} ${rating === 1 ? 'estrela' : 'estrelas'} para você`;
    
    await supabase.from('notifications').insert({
      user_id: userId,
      title,
      content,
      type: 'rating',
      read: false
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação de avaliação:', error);
    return false;
  }
}

// Outras funções de notificação podem ser adicionadas aqui
