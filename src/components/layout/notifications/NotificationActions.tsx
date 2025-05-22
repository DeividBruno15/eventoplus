
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationActionsProps {
  isHovered: boolean;
  isRead: boolean;
  onMarkAsRead: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const NotificationActions = ({
  isHovered,
  isRead,
  onMarkAsRead,
  onDelete,
  isDeleting
}: NotificationActionsProps) => {
  return (
    <div className={cn(
      "absolute right-2 top-2 flex gap-1 transition-opacity",
      isHovered ? "opacity-100" : "opacity-0"
    )}>
      {!isRead && (
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
  );
};
