
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarHeader,
  SidebarInset
} from '@/components/ui/sidebar';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  Bell, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from 'lucide-react';

const DashboardLayout = () => {
  const { session, loading: sessionLoading } = useSession();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(window.location.pathname);

  // Função para obter as iniciais do nome do usuário
  const getUserInitials = () => {
    if (!user) return "?";
    
    // Tenta obter o nome dos metadados de usuário
    const firstName = user.user_metadata?.first_name as string | undefined;
    const lastName = user.user_metadata?.last_name as string | undefined;
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "U";
  };
  
  const userName = user?.user_metadata?.first_name || 'Usuário';
  const userRole = user?.user_metadata?.role;

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/profile',
      name: 'Perfil',
      icon: User,
    },
    {
      path: '/events',
      name: 'Meus Eventos',
      icon: Calendar,
    },
    {
      path: '/service-providers',
      name: 'Serviços',
      icon: Briefcase,
    },
    {
      path: '/chat',
      name: 'Chat',
      icon: MessageSquare,
    },
    {
      path: '/settings',
      name: 'Configurações',
      icon: Settings,
    },
  ];

  const handleNavigation = (path: string) => {
    setActivePath(path);
    navigate(path);
  };

  // Se estiver carregando, exibimos um spinner
  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <div className="font-bold text-xl text-primary">Evento<span className="text-secondary">+</span></div>
          </SidebarHeader>
          <SidebarContent className="py-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.path)}
                    tooltip={item.name}
                    isActive={activePath === item.path}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          {/* Header com informações do usuário e botões de ação */}
          <div className="sticky top-0 z-10 w-full bg-white border-b shadow-sm p-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">
                {activePath === '/dashboard' ? 'Dashboard' : 
                 activePath === '/profile' ? 'Perfil' :
                 activePath === '/events' ? 'Meus Eventos' :
                 activePath === '/service-providers' ? 'Serviços' :
                 activePath === '/chat' ? 'Chat' :
                 activePath === '/settings' ? 'Configurações' : 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notificações */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    <DropdownMenuItem className="cursor-pointer py-3">
                      <div>
                        <p className="font-medium">Nova mensagem recebida</p>
                        <p className="text-xs text-gray-500">Há 5 minutos</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-3">
                      <div>
                        <p className="font-medium">Evento confirmado</p>
                        <p className="text-xs text-gray-500">Há 2 horas</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-3">
                      <div>
                        <p className="font-medium">Proposta aceita</p>
                        <p className="text-xs text-gray-500">Há 1 dia</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center cursor-pointer">
                    Ver todas as notificações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Menu do usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium hidden md:block">{userName}</span>
                    <Avatar className="h-9 w-9 bg-primary text-primary-foreground">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('/settings')} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Conteúdo principal - usa Outlet para renderizar as rotas aninhadas */}
          <div className="flex-grow p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
