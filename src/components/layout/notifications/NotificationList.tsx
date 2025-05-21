
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/hooks/useNotifications';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';

interface NotificationListProps {
  notifications: Notification[];
  onCloseMenu: () => void;
}

export function NotificationList({ notifications, onCloseMenu }: NotificationListProps) {
  const { user } = useAuth();
  const { markAsRead, deleteNotification } = useNotifications(user?.id);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);
  
  // Function to handle notification deletion
  const handleDeleteNotification = async (id: string) => {
    try {
      setDeleteInProgress(id);
      await deleteNotification(id);
    } finally {
      setDeleteInProgress(null);
    }
  };

  // Function to handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Navigate to notification link if it exists
    if (notification.link) {
      window.location.href = notification.link;
      onCloseMenu();
    }
    
    // Mark as read when clicked
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <ScrollArea className="max-h-96">
      <div>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={handleNotificationClick}
            onMarkAsRead={() => markAsRead(notification.id)}
            onDelete={() => handleDeleteNotification(notification.id)}
            isDeleting={deleteInProgress === notification.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
