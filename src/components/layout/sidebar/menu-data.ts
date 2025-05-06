
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  MessagesSquare, 
  Settings,
  HelpCircle,
  LifeBuoy,
  Building
} from 'lucide-react';
import { MenuItem } from './types';

export const getMainMenuItems = (userRole: string): MenuItem[] => {
  const baseItems: MenuItem[] = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', name: 'Perfil', icon: User },
  ];
  
  // Add events/announcements item based on user role
  if (userRole === 'advertiser') {
    baseItems.push({ path: '/venues', name: 'Anúncios', icon: Building });
  } else {
    baseItems.push({ path: '/events', name: 'Eventos', icon: Calendar });
  }
  
  // Add remaining common items
  return [
    ...baseItems,
    { path: '/chat', name: 'Chat', icon: MessagesSquare },
    { path: '/settings', name: 'Configurações', icon: Settings },
  ];
};

export const supportMenuItems: MenuItem[] = [
  { path: '/help-center', name: 'Central de Ajuda', icon: HelpCircle },
  { path: '/support', name: 'Suporte', icon: LifeBuoy },
];
