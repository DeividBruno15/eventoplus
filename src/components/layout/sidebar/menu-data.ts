
import { LayoutDashboard, Calendar, MessageSquare, User, Building, Settings, HelpCircle, Building2, CreditCard, LifeBuoy } from 'lucide-react';
import { MenuItem } from './types';

export const getMainMenuItems = (userRole: string): MenuItem[] => {
  switch (userRole) {
    case 'provider':
      return [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          name: 'Eventos',
          path: '/events',
          icon: Calendar,
        },
        {
          name: 'Chat',
          path: '/chat',
          icon: MessageSquare,
          notificationKey: 'messages',
        },
        {
          name: 'Perfil',
          path: '/profile',
          icon: User,
        },
      ];
    case 'advertiser':
      return [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          name: 'Anúncios',
          path: '/venues',
          icon: Building2,
        },
        {
          name: 'Chat',
          path: '/chat',
          icon: MessageSquare,
          notificationKey: 'messages',
        },
        {
          name: 'Perfil',
          path: '/profile',
          icon: User,
        },
      ];
    case 'contractor':
    default:
      return [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          name: 'Eventos',
          path: '/events',
          icon: Calendar,
        },
        {
          name: 'Locais',
          path: '/venues',
          icon: Building,
        },
        {
          name: 'Chat',
          path: '/chat',
          icon: MessageSquare,
          notificationKey: 'messages',
        },
        {
          name: 'Perfil',
          path: '/profile',
          icon: User,
        },
      ];
  }
};

export const getSupportMenuItems = (userRole: string): MenuItem[] => {
  return [
    {
      name: 'Assinatura',
      path: '/payments',
      icon: CreditCard,
    },
    {
      name: 'Central de Ajuda',
      path: '/help-center',
      icon: HelpCircle,
    },
    {
      name: 'Suporte',
      path: '/support',
      icon: LifeBuoy,
    },
    {
      name: 'Configurações',
      path: '/settings',
      icon: Settings,
    }
  ];
};
