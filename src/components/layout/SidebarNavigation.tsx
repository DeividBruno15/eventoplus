
import { useState, useEffect } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  // Atualizar o caminho ativo quando a localização mudar
  useEffect(() => {
    if (location.pathname !== activePath) {
      onNavigate(location.pathname);
    }
  }, [location, activePath, onNavigate]);

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

  const handleMenuItemClick = (path: string) => {
    console.log('Navegando para:', path);
    // Informar ao componente pai sobre a mudança
    onNavigate(path);
    // Navegar para a rota
    navigate(path);
  };

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
        {filteredItems.map((item, index) => (
          <SidebarMenuItem 
            key={item.path}
            className="transition-all duration-200 ease-in-out"
            style={{ 
              animationDelay: `${index * 50}ms`,
              opacity: 0,
              animation: 'fade-in 0.3s ease-out forwards'
            }}
          >
            <SidebarMenuButton
              onClick={() => handleMenuItemClick(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out transform hover:translate-x-1 ${
                activePath === item.path
                  ? 'bg-primary/10 text-primary font-medium scale-105'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-primary hover:scale-[1.02]'
              }`}
            >
              <item.icon className={`h-5 w-5 transition-transform duration-200 ${
                activePath === item.path ? 'scale-110' : ''
              }`} />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
};
