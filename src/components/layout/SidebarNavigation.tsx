
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  MessagesSquare, 
  Settings
} from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';

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
  const menuItems: MenuItem[] = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', name: 'Perfil', icon: User },
    { path: '/events', name: 'Eventos', icon: Calendar },
    { path: '/chat', name: 'Chat', icon: MessagesSquare },
    { path: '/settings', name: 'Configurações', icon: Settings },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            onClick={() => onNavigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              activePath === item.path
                ? 'bg-primary text-white'
                : 'hover:bg-primary/5 text-gray-600 hover:text-primary'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
