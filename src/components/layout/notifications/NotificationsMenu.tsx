
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Bell } from 'lucide-react';
import { EmptyNotificationState } from './EmptyNotificationState';
import { ScrollArea } from "@/components/ui/scroll-area";

type NotificationsMenuProps = {
  unreadCount: number;
}

export function NotificationsMenu({ unreadCount }: NotificationsMenuProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h4 className="text-sm font-medium">Notificações</h4>
          <Button variant="ghost" size="sm" className="text-xs">
            Marcar todas como lidas
          </Button>
        </div>
        
        <Separator />
        
        <ScrollArea className="max-h-96">
          <EmptyNotificationState />
        </ScrollArea>
        
        <Separator />
        <div className="p-2">
          <Button asChild variant="ghost" className="w-full text-sm justify-start">
            <Link to="/notifications">Ver todas as notificações</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
