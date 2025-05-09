
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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchNotifications = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const data = await notificationsService.getUserNotifications(userId);
      
      if (data) {
        setNotifications(data as Notification[]);
        setUnreadCount(data.filter(n => !n.read).length);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const success = await notificationsService.markAsRead(notificationId);
      
      if (success) {
        // Update local state without refetching
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true } 
              : notification
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId || notifications.length === 0) return;
    
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
        
      if (unreadIds.length === 0) return;
      
      // Update each notification individually
      for (const id of unreadIds) {
        await notificationsService.markAsRead(id);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Delete the notification directly in Supabase
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
      
      // Update unread count if needed
      const wasUnread = notifications.find(n => n.id === notificationId && !n.read);
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!userId) return;

    // Using Supabase's native channel functionality instead of a non-existent subscribeToNotifications method
    const channel = supabase
      .channel(`user_notifications_${userId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New notification received:', payload.new);
          
          // Add the new notification to the list
          setNotifications(prev => [payload.new as Notification, ...prev]);
          
          // Update unread count
          setUnreadCount(prev => prev + 1);
          
          // Update last updated
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    if (!userId) return;
    
    fetchNotifications();
  }, [userId]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    lastUpdated
  };
};
