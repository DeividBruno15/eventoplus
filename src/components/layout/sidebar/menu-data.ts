import { Home, Calendar, Users, CheckSquare, UserPlus, Briefcase, MessageSquare, Star, CreditCard } from 'lucide-react';

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
