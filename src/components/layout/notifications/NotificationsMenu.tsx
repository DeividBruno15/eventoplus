
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell, BellOff, Check, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { EmptyNotificationState } from './EmptyNotificationState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    fetchNotifications,
    lastUpdated
  } = useNotifications(user?.id);
  const [realtime, setRealtime] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);

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

  // Function to update realtime state and show animation
  useEffect(() => {
    if (unreadCount > 0) {
      setRealtime(true);
      // Remove the class after animation
      const timer = setTimeout(() => {
        setRealtime(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  // Auto refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        fetchNotifications();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications, user?.id]);

  // Function to handle notification deletion
  const handleDeleteNotification = async (id: string) => {
    try {
      setDeleteInProgress(id);
      await deleteNotification(id);
    } finally {
      setDeleteInProgress(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
        >
          {unreadCount > 0 ? (
            <Bell className="h-5 w-5" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className={cn(
                "absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center",
                realtime ? 'animate-pulse' : ''
              )}
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h4 className="text-sm font-medium">Notificações</h4>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => fetchNotifications()}
                  aria-label="Atualizar notificações"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Atualizar notificações</TooltipContent>
            </Tooltip>
            
            {notifications.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={markAllAsRead}
                    aria-label="Marcar todas como lidas"
                    disabled={notifications.every(n => n.read)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Marcar todas como lidas</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <Separator />
        
        {isLoading ? (
          <div className="p-4 h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length > 0 ? (
          <ScrollArea className="max-h-96">
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={(notification) => {
                    // Navigate to notification link if it exists
                    if (notification.link) {
                      window.location.href = notification.link;
                      setOpen(false);
                    }
                    // Mark as read when clicked
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                  }}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onDelete={() => handleDeleteNotification(notification.id)}
                  isDeleting={deleteInProgress === notification.id}
                />
              ))}
            </div>
          </ScrollArea>
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
