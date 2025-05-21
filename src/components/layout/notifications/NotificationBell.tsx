
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { useSession } from "@/contexts/SessionContext";
import { useState, useEffect } from "react";

export function NotificationBell({ onClick }: { onClick?: () => void }) {
  const { session } = useSession();
  const { unreadCount, isLoading } = useNotifications(session?.user?.id);
  const [realtime, setRealtime] = useState(false);
  
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
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative"
      aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
      onClick={onClick}
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
  );
}
