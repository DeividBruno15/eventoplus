
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { type Notification } from '@/hooks/useNotifications';

type NotificationItemProps = {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onMarkAsRead?: () => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onClick,
  onMarkAsRead,
  onDelete 
}) => {
  return (
    <DropdownMenuItem 
      key={notification.id} 
      className="cursor-pointer"
      onClick={() => onClick(notification)}
    >
      <div className="flex flex-col gap-1 py-2">
        <div className="flex items-center justify-between">
          <p className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
            {notification.title}
          </p>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: ptBR
            })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{notification.content}</p>
      </div>
    </DropdownMenuItem>
  );
};
