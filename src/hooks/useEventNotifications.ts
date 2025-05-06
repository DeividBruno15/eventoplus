
import { Event } from '@/types/events';
import { notificationsService } from '@/services/notifications';

/**
 * Utility functions for sending event-related notifications
 */

// Notificação para aplicações em eventos
export const sendApplicationNotification = async (
  event: Event,
  contractorId: string,
  title: string,
  content: string,
  type: string
) => {
  await notificationsService.sendNotification({
    userId: contractorId,
    title,
    content,
    type,
    link: `/events/${event.id}`
  });
};

// Notificação para prestadores de serviços
export const sendProviderNotification = async (
  event: Event,
  providerId: string,
  title: string,
  content: string,
  type: string
) => {
  await notificationsService.sendNotification({
    userId: providerId,
    title,
    content,
    type,
    link: `/events/${event.id}`
  });
};

// Notificação para avaliações
export const sendRatingNotification = async (
  userId: string,
  ratingScore: number,
  reviewerName: string
) => {
  await notificationsService.sendNotification({
    userId,
    title: "Nova avaliação recebida",
    content: `${reviewerName} deixou uma avaliação de ${ratingScore} estrelas para você.`,
    type: "rating",
    link: `/users/${userId}`
  });
};

// Notificação para pagamentos
export const sendPaymentNotification = async (
  userId: string,
  amount: number,
  eventId?: string,
  isSuccess: boolean = true
) => {
  const title = isSuccess ? "Pagamento confirmado" : "Problema com pagamento";
  const content = isSuccess 
    ? `Seu pagamento de R$ ${amount.toFixed(2)} foi processado com sucesso.`
    : `Houve um problema com seu pagamento de R$ ${amount.toFixed(2)}. Por favor, verifique.`;
  
  const link = eventId ? `/events/${eventId}` : `/payments`;
  
  await notificationsService.sendNotification({
    userId,
    title,
    content,
    type: "payment",
    link
  });
};

// Notificação para mensagens
export const sendMessageNotification = async (
  userId: string,
  senderName: string,
  conversationId: string,
  messagePreview: string
) => {
  await notificationsService.sendNotification({
    userId,
    title: `Nova mensagem de ${senderName}`,
    content: messagePreview.length > 50 ? `${messagePreview.substring(0, 50)}...` : messagePreview,
    type: "message",
    link: `/chat/${conversationId}`
  });
};

// Notificação para atualizações de evento
export const sendEventUpdateNotification = async (
  userId: string,
  eventId: string,
  eventName: string,
  updateType: 'created' | 'updated' | 'canceled' | 'completed'
) => {
  let title = "";
  let content = "";
  
  switch (updateType) {
    case 'created':
      title = "Novo evento criado";
      content = `O evento "${eventName}" foi criado e está aguardando prestadores.`;
      break;
    case 'updated':
      title = "Evento atualizado";
      content = `O evento "${eventName}" foi atualizado. Verifique as novas informações.`;
      break;
    case 'canceled':
      title = "Evento cancelado";
      content = `O evento "${eventName}" foi cancelado pelo organizador.`;
      break;
    case 'completed':
      title = "Evento concluído";
      content = `O evento "${eventName}" foi marcado como concluído.`;
      break;
  }
  
  await notificationsService.sendNotification({
    userId,
    title,
    content,
    type: "event",
    link: `/events/${eventId}`
  });
};

// Notificação geral para usuários
export const sendGeneralNotification = async (
  userId: string,
  title: string,
  content: string,
  link?: string,
  type: string = "general"
) => {
  await notificationsService.sendNotification({
    userId,
    title,
    content,
    type,
    link: link || '/dashboard'
  });
};
