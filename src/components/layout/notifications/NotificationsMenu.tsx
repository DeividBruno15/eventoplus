
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Separator } from '@/components/ui/separator';
import { NotificationBell } from './NotificationBell';
import { NotificationHeader } from './NotificationHeader';
import { NotificationList } from './NotificationList';
import { EmptyNotificationState } from './EmptyNotificationState';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAllAsRead, 
    fetchNotifications,
    lastUpdated
  } = useNotifications(user?.id);

  // Effect to mark notifications as read when the menu is opened
  useEffect(() => {
    if (open && unreadCount > 0) {
      // Add a small delay to allow user to see which notifications are new
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [open, unreadCount, markAllAsRead]);

  // Auto refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        fetchNotifications();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications, user?.id]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <NotificationBell />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationHeader 
          unreadCount={unreadCount}
          onRefresh={fetchNotifications}
          onMarkAllAsRead={markAllAsRead}
          hasNotifications={notifications.length > 0}
        />
        
        <Separator />
        
        {isLoading ? (
          <div className="p-4 h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length > 0 ? (
          <NotificationList 
            notifications={notifications}
            onCloseMenu={() => setOpen(false)}
          />
        ) : (
          <EmptyNotificationState />
        )}
        
        <Separator />
        <div className="p-2">
          <Button asChild variant="ghost" className="w-full text-sm justify-start">
            <Link to="/notifications">Ver todas as notificações</Link>
          </Button>
        </div>
        <div className="p-2 pt-0">
          <p className="text-xs text-muted-foreground text-center">
            Última atualização: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
