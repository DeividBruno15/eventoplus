
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  const [animate, setAnimate] = useState(false);
  
  // Efeito para animar o ícone quando chegam novas notificações
  useEffect(() => {
    if (unreadCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={cn(
        "relative",
        animate ? "animate-wiggle" : ""
      )}
      aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
}

export default NotificationBell;
