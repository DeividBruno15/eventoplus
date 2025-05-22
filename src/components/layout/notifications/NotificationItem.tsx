
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Notification } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { NotificationIcon } from './NotificationIcon';
import { NotificationActions } from './NotificationActions';

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export const NotificationItem = ({
  notification,
  onClick,
  onMarkAsRead,
  onDelete,
  isDeleting = false
}: NotificationItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Relative time formatting
  const formatRelativeTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return 'Data desconhecida';
    }
  };

  return (
    <div
      className={cn(
        "px-4 py-3 border-b relative transition-all",
        notification.read ? "bg-white" : "bg-blue-50",
        isHovered ? "bg-gray-50" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <NotificationIcon type={notification.type} />
        </div>
        
        <div 
          className="flex-grow cursor-pointer" 
          onClick={() => onClick(notification)}
        >
          <h5 className="text-sm font-medium mb-1">{notification.title}</h5>
          <p className="text-sm text-muted-foreground">{notification.content}</p>
          <span className="text-xs text-muted-foreground mt-1 block">
            {formatRelativeTime(notification.created_at)}
          </span>
        </div>
        
        <NotificationActions 
          isHovered={isHovered}
          isRead={notification.read}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
