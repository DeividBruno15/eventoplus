
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  User,
  Building,
  Settings,
  HelpCircle,
  Building2,
  CreditCard,
  LifeBuoy,
  Briefcase
} from 'lucide-react';
import { MenuItem } from './types';

export const getMainMenuItems = (user: any): MenuItem[] => {
  const baseMenuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
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

  // Get user preferences
  const userPreferences = user?.user_metadata || {};
  const dynamicMenuItems: MenuItem[] = [];

  // Add menu items based on user preferences from onboarding
  if (userPreferences.is_contratante) {
    dynamicMenuItems.push({
      name: 'Meus Eventos',
      path: '/events',
      icon: Calendar,
    });
    
    dynamicMenuItems.push({
      name: 'Prestadores',
      path: '/providers',
      icon: Briefcase,
    });
  }
  
  if (userPreferences.divulga_servicos || userPreferences.is_prestador) {
    dynamicMenuItems.push({
      name: 'Meus Serviços',
      path: '/services',
      icon: Briefcase,
    });
  }
  
  if (userPreferences.candidata_eventos || userPreferences.is_prestador) {
    dynamicMenuItems.push({
      name: 'Eventos',
      path: '/events',
      icon: Calendar,
    });
  }
  
  if (userPreferences.divulga_locais) {
    dynamicMenuItems.push({
      name: 'Meus Locais',
      path: '/venues',
      icon: Building,
    });
  }

  // Sort menu items to maintain consistency
  dynamicMenuItems.sort((a, b) => a.name.localeCompare(b.name));
  
  // Return base menu items plus dynamic items
  return [
    baseMenuItems[0], // Dashboard always first
    ...dynamicMenuItems,
    ...baseMenuItems.slice(1) // Rest of base items (Chat, Profile)
  ];
};

export const getSupportMenuItems = (): MenuItem[] => {
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
