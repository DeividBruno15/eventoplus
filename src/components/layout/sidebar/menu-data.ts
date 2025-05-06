
import { Home, Calendar, Users, CheckSquare, UserPlus, Briefcase, MessageSquare, Star, CreditCard, HelpCircle, Settings } from 'lucide-react';
import { MenuItem } from './types';

export const menuItems = [
  {
    label: 'Início',
    href: '/dashboard',
    icon: Home,
    roles: ['all']
  },
  {
    label: 'Eventos',
    href: '/events',
    icon: Calendar,
    roles: ['contractor', 'provider']
  },
  {
    label: 'Prestadores',
    href: '/providers',
    icon: Briefcase,
    roles: ['contractor']
  },
  {
    label: 'Clientes',
    href: '/contractors',
    icon: Users,
    roles: ['provider']
  },
  {
    label: 'Leads',
    href: '/leads',
    icon: UserPlus,
    roles: ['provider']
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: MessageSquare,
    roles: ['contractor', 'provider']
  },
  {
    label: 'Avaliações',
    href: '/reviews',
    icon: Star,
    roles: ['contractor', 'provider']
  },
  {
    label: 'Tarefas',
    href: '/tasks',
    icon: CheckSquare,
    roles: ['contractor', 'provider']
  },
  {
    label: 'Pagamentos',
    href: '/payments',
    icon: CreditCard,
    roles: ['all']
  },
];

// Função para obter itens de menu baseado no papel do usuário
export const getMainMenuItems = (userRole: string): MenuItem[] => {
  return menuItems
    .filter(item => item.roles.includes('all') || item.roles.includes(userRole))
    .map(item => ({
      path: item.href,
      name: item.label,
      icon: item.icon
    }));
};

// Itens do menu de suporte
export const supportMenuItems: MenuItem[] = [
  {
    path: '/help-center',
    name: 'Central de Ajuda',
    icon: HelpCircle
  },
  {
    path: '/settings',
    name: 'Configurações',
    icon: Settings
  }
];
