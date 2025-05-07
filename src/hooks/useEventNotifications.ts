
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

// Função para enviar notificação de pagamento
export async function sendPaymentNotification(
  userId: string,
  amount: number,
  description?: string,
  isRefund: boolean = false
) {
  try {
    const title = isRefund 
      ? `Reembolso processado com sucesso` 
      : `Pagamento processado com sucesso`;
    
    const content = description 
      ? `${isRefund ? 'Reembolso' : 'Pagamento'} de R$ ${amount.toFixed(2)} - ${description}`
      : `${isRefund ? 'Reembolso' : 'Pagamento'} de R$ ${amount.toFixed(2)} processado em sua conta`;
    
    await supabase.from('notifications').insert({
      user_id: userId,
      title,
      content,
      type: isRefund ? 'refund' : 'payment',
      read: false
    });
    
    return true;
  } catch (error) {
    console.error(`Erro ao enviar notificação de ${isRefund ? 'reembolso' : 'pagamento'}:`, error);
    return false;
  }
}

// Outras funções de notificação podem ser adicionadas aqui
