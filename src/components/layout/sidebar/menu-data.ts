
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Settings,
  User,
  CreditCard,
  Building2,
  Bell,
  MapPin,
  Phone,
  Building,
  HelpCircle
} from "lucide-react";
import { MenuItem } from "./types";

// Menu principal
export const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Meus Eventos",
    icon: Calendar,
    path: "/events",
    roles: ["contractor"],
  },
  {
    name: "Eventos",
    icon: Calendar,
    path: "/events",
    roles: ["provider"],
  },
  {
    name: "Locais de eventos",
    icon: Building,
    path: "/venues",
    roles: ["contractor"],
  },
  {
    name: "Chat",
    icon: MessageSquare,
    path: "/chat",
    roles: ["provider", "contractor", "advertiser"],
    notificationKey: "messages",
  },
  {
    name: "Minha assinatura",
    icon: CreditCard,
    path: "/payments",
    roles: ["provider", "contractor", "advertiser"],
  },
  {
    name: "Meus anúncios",
    icon: Building2,
    path: "/venues",
    roles: ["advertiser"],
  },
  {
    name: "Notificações",
    icon: Bell,
    path: "/notifications",
    roles: ["provider", "contractor", "advertiser"],
    notificationKey: "unread_notifications",
  },
  {
    name: "WhatsApp",
    icon: Phone,
    path: "/whatsapp",
    roles: ["provider", "contractor", "advertiser"],
  },
];

// Menu de suporte
export const supportMenuItems: MenuItem[] = [
  {
    name: "Perfil",
    icon: User,
    path: "/profile",
    roles: ["provider", "contractor", "advertiser"],
  },
  {
    name: "Configurações",
    icon: Settings,
    path: "/settings",
    roles: ["provider", "contractor", "advertiser"],
  },
  {
    name: "Suporte",
    icon: HelpCircle,
    path: "/support",
    roles: ["provider", "contractor", "advertiser"],
  },
];

// Função para obter os itens do menu com base no papel do usuário
export const getMainMenuItems = (userRole: string): MenuItem[] => {
  if (!userRole) return menuItems;
  
  return menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );
};

// Função para obter os itens do menu de suporte
export const getSupportMenuItems = (userRole: string): MenuItem[] => {
  if (!userRole) return supportMenuItems;
  
  return supportMenuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );
};
