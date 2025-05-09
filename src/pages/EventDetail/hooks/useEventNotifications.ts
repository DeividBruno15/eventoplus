
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
  console.log(`Sending notification to contractor ${contractorId} for event ${event.id}:`, {
    title,
    content,
    type
  });
  
  try {
    const result = await notificationsService.sendNotification({
      userId: contractorId,
      title,
      content,
      type,
      link: `/events/${event.id}`
    });
    
    if (result) {
      console.log(`Successfully sent notification to contractor ${contractorId}`);
    } else {
      console.error(`Failed to send notification to contractor ${contractorId}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error in sendApplicationNotification:', error);
    return false;
  }
};

export const sendProviderNotification = async (
  event: Event,
  providerId: string,
  title: string,
  content: string,
  type: string
) => {
  console.log(`Sending notification to provider ${providerId} for event ${event.id}:`, {
    title,
    content,
    type
  });
  
  try {
    const result = await notificationsService.sendNotification({
      userId: providerId,
      title,
      content,
      type,
      link: `/events/${event.id}`
    });
    
    if (result) {
      console.log(`Successfully sent notification to provider ${providerId}`);
    } else {
      console.error(`Failed to send notification to provider ${providerId}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error in sendProviderNotification:', error);
    return false;
  }
};
