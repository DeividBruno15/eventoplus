
import { supabase } from '@/integrations/supabase/client';

interface SendNotificationParams {
  userId: string;
  title: string;
  content: string;
  type: string;
  link?: string;
}

export const notificationsService = {
  /**
   * Send a notification to a user
   */
  async sendNotification({ userId, title, content, type, link }: SendNotificationParams): Promise<boolean> {
    try {
      console.log(`Sending notification to ${userId}:`, { title, content, type, link });
      
      if (!userId) {
        console.error('Cannot send notification: Missing userId');
        return false;
      }
      
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          content,
          type,
          link,
          read: false
        });
      
      if (error) {
        console.error('Error sending notification:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Unexpected error in sendNotification:', err);
      return false;
    }
  },
  
  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      return !error;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  },
  
  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  }
};
