
import { useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  MessagesSquare, 
  Settings,
  Search
} from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
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
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  
  const menuItems: MenuItem[] = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', name: 'Perfil', icon: User },
    { path: '/events', name: 'Eventos', icon: Calendar },
    { path: '/chat', name: 'Chat', icon: MessagesSquare },
    { path: '/settings', name: 'Configurações', icon: Settings },
  ];

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="relative transition-all duration-200 ease-in-out hover:scale-[1.02]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors duration-200" />
        <Input
          type="text"
          placeholder="Buscar menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 h-9 bg-white/50 border-none text-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
        />
      </div>
      
      <SidebarMenu>
        {filteredItems.map((item) => {
          // Check if the current path starts with this item's path for active state
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out transform hover:translate-x-1 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium scale-105'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-primary hover:scale-[1.02]'
                }`}
              >
                <Link 
                  to={item.path} 
                  onClick={() => onNavigate(item.path)}
                  className="flex items-center gap-3 w-full"
                >
                  <item.icon className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`} />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>
  );
};
