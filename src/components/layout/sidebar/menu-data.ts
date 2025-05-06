
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
    badge: 0,
  },
  {
    name: "Eventos",
    icon: Calendar,
    path: "/events",
    roles: ["provider"],
    badge: 0,
  },
  {
    name: "Locais de eventos",
    icon: Building,
    path: "/venues",
    roles: ["contractor"],
  },
  {
    name: "Mensagens",
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
    name: "Espaços",
    icon: Building2,
    path: "/venues",
    roles: ["advertiser"],
  },
  {
    name: "Notificações",
    icon: Bell,
    path: "/notifications",
    roles: ["provider", "contractor", "advertiser"],
  },
  {
    name: "WhatsApp",
    icon: Phone,
    path: "/whatsapp",
    roles: ["provider", "contractor", "advertiser"],
    badge: 0,
  },
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
];

// Menu de suporte
export const supportMenuItems: MenuItem[] = [
  {
    name: "Suporte",
    icon: MapPin,
    path: "/support",
  }
];

// Função para obter os itens do menu com base no papel do usuário
export const getMainMenuItems = (userRole: string): MenuItem[] => {
  if (!userRole) return menuItems;
  
  return menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );
};
