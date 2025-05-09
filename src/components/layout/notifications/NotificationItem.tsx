
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Bell, 
  Calendar, 
  Check, 
  Home, 
  Mail, 
  MapPin, 
  Star, 
  Trash2, 
  DollarSign,
  Users,
  AlertCircle
} from 'lucide-react';
import { Notification } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  
  // Function to determine the icon based on notification type
  const getNotificationIcon = () => {
    const type = notification.type || '';
    
    if (type.includes('rating')) return <Star className="h-5 w-5 text-yellow-500" />;
    if (type.includes('payment')) return <DollarSign className="h-5 w-5 text-green-600" />;
    if (type.includes('refund')) return <DollarSign className="h-5 w-5 text-orange-500" />;
    if (type.includes('event')) return <Calendar className="h-5 w-5 text-blue-500" />;
    if (type.includes('venue')) return <Home className="h-5 w-5 text-purple-500" />;
    if (type.includes('location')) return <MapPin className="h-5 w-5 text-indigo-500" />;
    if (type.includes('message')) return <Mail className="h-5 w-5 text-cyan-500" />;
    if (type.includes('application')) return <Users className="h-5 w-5 text-indigo-600" />;
    if (type.includes('system')) return <AlertCircle className="h-5 w-5 text-red-500" />;
    
    return <Bell className="h-5 w-5 text-gray-500" />;
  };
  
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
          {getNotificationIcon()}
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
        
        {/* Action buttons (visible only on hover) */}
        <div className={cn(
          "absolute right-2 top-2 flex gap-1 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-destructive hover:text-destructive" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-destructive animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
