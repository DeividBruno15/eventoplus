
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Função para enviar notificação de evento
export async function sendEventNotification(
  userId: string,
  eventId: string,
  eventName: string,
  type: 'created' | 'updated' | 'canceled' | 'reminder'
) {
  try {
    let title, content;
    
    switch (type) {
      case 'created':
        title = 'Novo evento criado';
        content = `O evento "${eventName}" foi criado com sucesso`;
        break;
      case 'updated':
        title = 'Evento atualizado';
        content = `O evento "${eventName}" foi atualizado`;
        break;
      case 'canceled':
        title = 'Evento cancelado';
        content = `O evento "${eventName}" foi cancelado`;
        break;
      case 'reminder':
        title = 'Lembrete de evento';
        content = `Seu evento "${eventName}" está se aproximando`;
        break;
    }
    
    await supabase.from('notifications').insert({
      user_id: userId,
      title,
      content,
      type: `event_${type}`,
      link: `/events/${eventId}`,
      read: false
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação de evento:', error);
    return false;
  }
}

// Função para enviar notificação de disponibilidade de local
export async function sendVenueAvailabilityNotification(
  userId: string,
  venueId: string,
  venueName: string,
  dates: string[]
) {
  try {
    const title = 'Atualização de disponibilidade';
    const content = `O local "${venueName}" tem novas datas disponíveis`;
    
    await supabase.from('notifications').insert({
      user_id: userId,
      title,
      content,
      type: 'venue_availability',
      link: `/venues/${venueId}`,
      read: false
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação de disponibilidade:', error);
    return false;
  }
}

// Função para notificar sobre candidaturas em eventos
export async function sendApplicationNotification(
  userId: string,
  eventId: string,
  eventName: string,
  providerId: string,
  providerName: string,
  status: 'new' | 'approved' | 'rejected'
) {
  try {
    let title, content;
    
    switch (status) {
      case 'new':
        title = 'Nova candidatura recebida';
        content = `${providerName} se candidatou para o evento "${eventName}"`;
        break;
      case 'approved':
        title = 'Candidatura aprovada';
        content = `Sua candidatura para o evento "${eventName}" foi aprovada`;
        break;
      case 'rejected':
        title = 'Candidatura rejeitada';
        content = `Sua candidatura para o evento "${eventName}" foi rejeitada`;
        break;
    }
    
    await supabase.from('notifications').insert({
      user_id: status === 'new' ? userId : providerId,
      title,
      content,
      type: `application_${status}`,
      link: `/events/${eventId}`,
      read: false
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação de candidatura:', error);
    return false;
  }
}

// Função para mostrar notificações do sistema como toasts
export function showSystemNotification(
  title: string,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info'
) {
  switch (type) {
    case 'success':
      toast.success(message, { description: title });
      break;
    case 'error':
      toast.error(message, { description: title });
      break;
    case 'warning':
      toast(message, { description: title });
      break;
    case 'info':
    default:
      toast(message, { description: title });
      break;
  }
}
