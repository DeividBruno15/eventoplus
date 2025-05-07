
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
    }
  ];
  
  // Adiciona eventos apenas para provider e contractor
  if (userRole === 'provider') {
    mainMenuItems.push({
      name: "Eventos",
      path: "/events",
      icon: Calendar,
    });
  } else if (userRole === 'contractor') {
    mainMenuItems.push({
      name: "Meus Eventos",
      path: "/events",
      icon: Calendar,
    });
  }
  
  // Adiciona "Locais de eventos" apenas para contratante
  if (userRole === 'contractor') {
    mainMenuItems.push({
      name: "Locais de eventos",
      path: "/venues",
      icon: Building,
    });
  }
  
  // Mensagens para todos os tipos
  mainMenuItems.push({
    name: "Chat",
    path: "/chat",
    icon: MessageSquare,
    notificationKey: "unread_messages"
  });
  
  // Minha assinatura para todos os tipos
  mainMenuItems.push({
    name: "Minha assinatura",
    path: "/payments",
    icon: CreditCard,
  });
  
  // Adiciona "Meus anúncios" para anunciantes - Changed from "Espaços" to "Meus anúncios"
  if (userRole === 'advertiser') {
    mainMenuItems.push({
      name: "Meus anúncios",
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
