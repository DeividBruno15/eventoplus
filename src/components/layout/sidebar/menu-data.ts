
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  MessagesSquare, 
  Settings,
  HelpCircle,
  LifeBuoy
} from 'lucide-react';
import { MenuItem } from './types';

export const mainMenuItems: MenuItem[] = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', name: 'Perfil', icon: User },
  { path: '/events', name: 'Eventos', icon: Calendar },
  { path: '/chat', name: 'Chat', icon: MessagesSquare },
  { path: '/settings', name: 'Configurações', icon: Settings },
];

export const supportMenuItems: MenuItem[] = [
  { path: '/help-center', name: 'Central de Ajuda', icon: HelpCircle },
  { path: '/support', name: 'Suporte', icon: LifeBuoy },
];
