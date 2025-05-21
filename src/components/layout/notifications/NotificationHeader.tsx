
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NotificationHeaderProps {
  unreadCount: number;
  onRefresh: () => void;
  onMarkAllAsRead: () => void;
  hasNotifications: boolean;
}

export function NotificationHeader({
  unreadCount,
  onRefresh,
  onMarkAllAsRead,
  hasNotifications
}: NotificationHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <h4 className="text-sm font-medium">Notificações</h4>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={onRefresh}
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
        
        {hasNotifications && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={onMarkAllAsRead}
                aria-label="Marcar todas como lidas"
                disabled={unreadCount === 0}
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Marcar todas como lidas</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
