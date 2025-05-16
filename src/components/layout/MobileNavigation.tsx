
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  User, 
  Building, 
  Building2 
} from 'lucide-react';
import { useUnreadMessages } from './sidebar/useUnreadMessages';
import { useNotifications } from '@/hooks/useNotifications';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'contractor';
  const unreadMessages = useUnreadMessages(user?.id);
  const { unreadCount } = useNotifications(user?.id);
  
  // Determinar qual conjunto de ícones mostrar com base no papel do usuário
  const getNavigationItems = () => {
    switch (userRole) {
      case 'provider':
        return [
          { icon: LayoutDashboard, label: 'Início', path: '/dashboard' },
          { icon: Calendar, label: 'Eventos', path: '/events' },
          { 
            icon: MessageSquare, 
            label: 'Chat', 
            path: '/chat',
            badge: unreadMessages > 0 ? unreadMessages : undefined 
          },
          { icon: User, label: 'Perfil', path: '/profile' },
        ];
      case 'advertiser':
        return [
          { icon: LayoutDashboard, label: 'Início', path: '/dashboard' },
          { icon: Building2, label: 'Anúncios', path: '/venues' },
          { 
            icon: MessageSquare, 
            label: 'Chat', 
            path: '/chat',
            badge: unreadMessages > 0 ? unreadMessages : undefined 
          },
          { icon: User, label: 'Perfil', path: '/profile' },
        ];
      case 'contractor':
      default:
        return [
          { icon: LayoutDashboard, label: 'Início', path: '/dashboard' },
          { icon: Calendar, label: 'Eventos', path: '/events' },
          { icon: Building, label: 'Locais', path: '/venues' },
          { 
            icon: MessageSquare, 
            label: 'Chat', 
            path: '/chat',
            badge: unreadMessages > 0 ? unreadMessages : undefined 
          },
          { icon: User, label: 'Perfil', path: '/profile' },
        ];
    }
  };

  const navItems = getNavigationItems();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t h-16 flex items-center z-50">
      <div className="flex justify-around w-full px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center w-full relative"
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center transition-all",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 mb-0.5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="text-[10px] font-medium">{item.label}</span>
                
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
