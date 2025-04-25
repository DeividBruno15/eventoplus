import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  MessagesSquare, 
  Settings,
  HelpCircle,
  LifeBuoy
} from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';

type MenuItem = {
  path: string;
  name: string;
  icon: any;
}

type SidebarNavigationProps = {
  activePath: string;
  onNavigate: (path: string) => void;
}

export const SidebarNavigation = ({ activePath, onNavigate }: SidebarNavigationProps) => {
  const location = useLocation();
  
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
    // Only log for debugging purposes
    console.log('Sidebar item clicked:', path);
    onNavigate(path);
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      const isActive = 
        location.pathname === item.path || 
        (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
      
      return (
        <SidebarMenuItem 
          key={item.path}
          className="transition-all duration-200 ease-in-out"
        >
          <SidebarMenuButton
            asChild
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-primary/10 text-primary font-medium scale-105'
                : 'hover:bg-gray-50 text-gray-600 hover:text-primary hover:translate-x-1'
            }`}
          >
            <Link 
              to={item.path}
              onClick={() => handleLinkClick(item.path)}
              className="flex items-center gap-3 w-full"
            >
              <item.icon className={`h-5 w-5 transition-transform duration-300 ${
                isActive ? 'scale-110 text-primary' : 'text-gray-500'
              }`} />
              <span>{item.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <SidebarMenu>
        {renderMenuItems(mainMenuItems)}
      </SidebarMenu>
      
      <div className="px-3 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
      
      <SidebarMenu>
        {renderMenuItems(supportMenuItems)}
      </SidebarMenu>
    </div>
  );
};
