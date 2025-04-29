
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { notificationsService } from '@/services/notifications';

export type Notification = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  read: boolean;
  link?: string;
  type?: string;
}

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        setNotifications(data as Notification[]);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const subscribeToNotifications = () => {
    if (!userId) return () => {};
    
    const unsubscribe = notificationsService.subscribeToNotifications(userId, () => {
      fetchNotifications();
    });
    
    return unsubscribe;
  };

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();
    const unsubscribe = subscribeToNotifications();

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    fetchNotifications
  };
};
