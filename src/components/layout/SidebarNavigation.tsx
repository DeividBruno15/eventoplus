
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
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 h-9 bg-white/50 border-none text-sm"
        />
      </div>
      
      <SidebarMenu>
        {filteredItems.map((item) => (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activePath === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-primary'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
};
