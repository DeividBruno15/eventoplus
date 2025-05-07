
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

type NotificationTriggerProps = {
  unreadCount: number;
}

export const NotificationTrigger: React.FC<NotificationTriggerProps> = ({ unreadCount }) => {
  return (
    <DropdownMenu>
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
      {/* We'll need to add the DropdownMenuContent and other items later */}
    </DropdownMenu>
  );
};
