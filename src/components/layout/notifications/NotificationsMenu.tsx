
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { EmptyNotificationState } from './EmptyNotificationState';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications(user?.id);
  const [realtime, setRealtime] = useState(false);

  // Efeito para marcar notificações como lidas quando o menu é aberto
  useEffect(() => {
    if (open && unreadCount > 0) {
      // Para melhorar a UX, adicionamos um pequeno delay para que o usuário 
      // possa ver quais notificações são novas antes de marcá-las como lidas
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [open, unreadCount, markAllAsRead]);

  // Função para atualizar o estado de realtime e mostrar uma animação
  useEffect(() => {
    if (unreadCount > 0) {
      setRealtime(true);
      // Remover a classe após a animação
      const timer = setTimeout(() => {
        setRealtime(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span 
              className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                realtime ? 'animate-ping-once' : ''
              }`}
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h4 className="text-sm font-medium">Notificações</h4>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
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
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
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
      </PopoverContent>
    </Popover>
  );
}
