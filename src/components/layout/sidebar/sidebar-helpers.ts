
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  User, 
  Bell,
  HelpCircle, 
  Phone,
  Building
} from 'lucide-react';
import { MenuItem } from './types';

// Helper function to get menu items based on user role
export const getSidebarMenuItems = (userRole: string) => {
  // Main menu items based on user role
  let mainMenuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Eventos",
      path: "/events",
      icon: Calendar,
    },
    {
      name: "Chat",
      path: "/chat",
      icon: MessageSquare,
      notificationKey: "unread_messages"
    },
    {
      name: "Pagamentos",
      path: "/payments",
      icon: CreditCard,
    }
  ];
  
  // Add role-specific menu items
  if (userRole === 'advertiser') {
    mainMenuItems.push({
      name: "Espaços",
      path: "/venues",
      icon: Building,
    });
  }
  
  // Add Notifications menu item
  mainMenuItems.push({
    name: "Notificações",
    path: "/notifications",
    icon: Bell,
    notificationKey: "unread_notifications"
  });

  // Support menu items (common to all roles)
  const supportMenuItems: MenuItem[] = [
    {
      name: "Perfil",
      path: "/profile",
      icon: User,
    },
    {
      name: "Configurações",
      path: "/settings",
      icon: Settings,
    },
    {
      name: "Suporte",
      path: "/support",
      icon: HelpCircle,
    },
    {
      name: "WhatsApp",
      path: "/whatsapp",
      icon: Phone,
    }
  ];

  return { mainMenuItems, supportMenuItems };
};
