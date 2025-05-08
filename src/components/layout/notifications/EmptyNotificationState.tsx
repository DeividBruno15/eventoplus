
import { Bell } from 'lucide-react';

export const EmptyNotificationState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Bell className="h-8 w-8 text-muted-foreground" />
      </div>
      <h4 className="text-sm font-medium mb-1">Nenhuma notificação</h4>
      <p className="text-sm text-muted-foreground max-w-[220px]">
        Quando você tiver notificações, elas aparecerão aqui.
      </p>
    </div>
  );
};
