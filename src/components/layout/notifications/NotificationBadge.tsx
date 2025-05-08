
import { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (unreadCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  if (unreadCount === 0) return null;
  
  return (
    <span 
      className={cn(
        "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center",
        animate && "animate-pulse",
        className
      )}
    >
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}
