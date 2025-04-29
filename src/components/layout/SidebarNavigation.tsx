
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  MessagesSquare, 
  Settings,
  HelpCircle,
  LifeBuoy,
  LogOut
} from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';

type MenuItem = {
  path: string;
  name: string;
  icon: React.ElementType;
}

type SidebarNavigationProps = {
  activePath: string;
  onNavigate: (path: string) => void;
}

export const SidebarNavigation = ({ activePath, onNavigate }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const { session, user, logout } = useAuth();
  const { toast } = useToast();
  
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const avatarUrl = user?.user_metadata?.avatar_url;
  
  const initials = firstName && lastName 
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() 
    : firstName 
      ? firstName.charAt(0).toUpperCase() 
      : 'U';
      
  const userRole = user?.user_metadata?.role || 'contractor';

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'contractor':
        return 'Contratante';
      case 'provider':
        return 'Prestador';
      default:
        return 'Usuário';
    }
  };

  const mainMenuItems: MenuItem[] = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', name: 'Perfil', icon: User },
    { path: '/events', name: 'Eventos', icon: Calendar },
    { path: '/chat', name: 'Chat', icon: MessagesSquare },
    { path: '/settings', name: 'Configurações', icon: Settings },
  ];

  const supportMenuItems: MenuItem[] = [
    { path: '/help-center', name: 'Central de Ajuda', icon: HelpCircle },
    { path: '/support', name: 'Suporte', icon: LifeBuoy },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      const isActive = 
        activePath === item.path || 
        (item.path !== '/dashboard' && activePath.startsWith(item.path));
      
      const Icon = item.icon;

      return (
        <SidebarMenuItem 
          key={item.path}
          className="transition-all duration-200 ease-in-out"
        >
          <SidebarMenuButton
            aria-current={isActive ? 'page' : undefined}
            onClick={() => handleLinkClick(item.path)}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-primary/10 text-primary font-medium scale-105'
                : 'hover:bg-gray-50 text-gray-600 hover:text-primary hover:translate-x-1'
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <Icon className={`h-5 w-5 transition-transform duration-300 ${
                isActive ? 'scale-110 text-primary' : 'text-gray-500'
              }`} />
              <span>{item.name}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="px-6 py-4">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-3">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <h3 className="font-medium text-gray-900">{firstName} {lastName}</h3>
          <span className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
            {getRoleLabel(userRole)}
          </span>
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
      
      <SidebarMenu>
        {renderMenuItems(mainMenuItems)}
      </SidebarMenu>
      
      <div className="px-3 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
      
      <SidebarMenu>
        {renderMenuItems(supportMenuItems)}
      </SidebarMenu>

      <div className="px-3 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-xl hover:bg-gray-50 text-red-500 hover:text-red-600 hover:translate-x-1 transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};
