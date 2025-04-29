
import { Event } from '@/types/events';
import { notificationsService } from '@/services/notifications';

/**
 * Utility functions for sending event-related notifications
 */
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
