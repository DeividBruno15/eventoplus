
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/useAuth';
import { useNotifications, type Notification } from '@/hooks/useNotifications';
import { NotificationTrigger } from './NotificationTrigger';
import { NotificationItem } from './NotificationItem';
import { EmptyNotificationState } from './EmptyNotificationState';

export const NotificationsMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead 
  } = useNotifications(user?.id);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <DropdownMenu>
      <NotificationTrigger unreadCount={unreadCount} />
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Notificações</p>
            <p className="text-xs leading-none text-muted-foreground">
              {unreadCount 
                ? `Você tem ${unreadCount} notificações não lidas`
                : 'Nenhuma notificação não lida'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))
          ) : (
            <EmptyNotificationState />
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
