
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  MessagesSquare, 
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
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  const getUserInitials = () => {
    if (!user) return "?";
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

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', name: 'Perfil', icon: User },
    { path: '/events', name: 'Eventos', icon: Calendar },
    { path: '/chat', name: 'Chat', icon: MessagesSquare },
    { path: '/settings', name: 'Configurações', icon: Settings },
  ];

  const handleNavigation = (path: string) => {
    setActivePath(path);
    navigate(path);
  };

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar variant="floating" className="border-none">
          <SidebarHeader className="p-4">
            <div className="font-bold text-xl text-primary">Evento<span className="text-secondary">+</span></div>
          </SidebarHeader>
          <SidebarContent className="py-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      activePath === item.path
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-primary'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 w-full bg-white border-b px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems.find(item => item.path === activePath)?.name || 'Dashboard'}
            </h1>
            
            <div className="flex items-center gap-4">
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
                    <DropdownMenuItem className="cursor-pointer">
                      <div className="py-2">
                        <p className="font-medium">Nova mensagem recebida</p>
                        <p className="text-xs text-gray-500">Há 5 minutos</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-9 w-9 bg-primary text-primary-foreground">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
