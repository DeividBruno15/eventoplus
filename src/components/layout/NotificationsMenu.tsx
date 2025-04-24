
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NotificationsMenu = () => {
  const notifications = [
    {
      id: 1,
      title: "Novo evento criado",
      description: "Seu evento foi criado com sucesso",
      time: "Agora"
    },
    {
      id: 2,
      title: "Nova mensagem",
      description: "Você recebeu uma nova mensagem",
      time: "5 min atrás"
    },
    {
      id: 3,
      title: "Lembrete",
      description: "Evento começará em 1 hora",
      time: "1 hora atrás"
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Notificações</p>
            <p className="text-xs leading-none text-muted-foreground">
              Você tem {notifications.length} notificações não lidas
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="cursor-pointer">
              <div className="flex flex-col gap-1 py-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{notification.title}</p>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
