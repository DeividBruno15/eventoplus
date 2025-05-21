
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { useSession } from "@/contexts/SessionContext";

export function NotificationBell() {
  const { session } = useSession();
  const { unreadCount, isLoading } = useNotifications(session?.user?.id);
  
  return (
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
            "absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center"
          )}
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
}
