
import { Event } from '@/types/events';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Utility functions for sending event-related notifications
 */
export const sendApplicationNotification = async (
  event: Event,
  recipientId: string,
  title: string,
  content: string,
  type: string
) => {
  console.log(`Sending notification to user ${recipientId} for event ${event.id}:`, {
    title,
    content,
    type
  });
  
  if (!recipientId) {
    console.error('Cannot send notification: recipientId is empty');
    return false;
  }
  
  try {
    const { data, error } = await supabase.from('notifications').insert({
      user_id: recipientId,
      title,
      content,
      type,
      link: `/events/${event.id}`,
      read: false
    }).select();
    
    if (error) {
      console.error(`Failed to send notification to user ${recipientId}:`, error);
      return false;
    }
    
    console.log(`Successfully sent notification to user ${recipientId}:`, data);
    return true;
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
    const { data, error } = await supabase.from('notifications').insert({
      user_id: providerId,
      title,
      content,
      type,
      link: `/events/${event.id}`,
      read: false
    }).select();
    
    if (error) {
      console.error(`Failed to send notification to provider ${providerId}:`, error);
      return false;
    }
    
    console.log(`Successfully sent notification to provider ${providerId}:`, data);
    return true;
  } catch (error) {
    console.error('Error in sendProviderNotification:', error);
    return false;
  }
};

/**
 * Function to send notification about new application to event contractor
 */
export const sendNewApplicationNotification = async (
  event: Event,
  providerName: string
) => {
  if (!event || !event.contractor_id) {
    console.error('Cannot send new application notification: missing event or contractor_id');
    return false;
  }
  
  try {
    const title = 'Nova candidatura recebida';
    const content = `${providerName} se candidatou para o evento "${event.name}"`;
    
    const { data, error } = await supabase.from('notifications').insert({
      user_id: event.contractor_id,
      title,
      content,
      type: 'application_new',
      link: `/events/${event.id}`,
      read: false
    }).select();
    
    if (error) {
      console.error(`Failed to send new application notification to contractor ${event.contractor_id}:`, error);
      return false;
    }
    
    console.log(`Successfully sent new application notification to contractor ${event.contractor_id}:`, data);
    return true;
  } catch (error) {
    console.error('Error in sendNewApplicationNotification:', error);
    return false;
  }
};
