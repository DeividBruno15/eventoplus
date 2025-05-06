
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
} from "lucide-react";
import { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Eventos",
    icon: Calendar,
    href: "/events",
    roles: ["provider", "contractor", "advertiser"],
    badge: "new",
  },
  {
    title: "Mensagens",
    icon: MessageSquare,
    href: "/chat",
    roles: ["provider", "contractor", "advertiser"],
    notificationKey: "messages",
  },
  {
    title: "Pagamentos",
    icon: CreditCard,
    href: "/payments",
    roles: ["provider", "contractor", "advertiser"],
  },
  {
    title: "Espaços",
    icon: Building2,
    href: "/venues",
    roles: ["contractor", "advertiser"],
  },
  {
    title: "Notificações",
    icon: Bell,
    href: "/notifications",
    roles: ["provider", "contractor", "advertiser"],
  },
  {
    title: "WhatsApp",
    icon: Phone,
    href: "/whatsapp",
    roles: ["provider", "contractor", "advertiser"],
    badge: "beta",
  },
  {
    title: "Perfil",
    icon: User,
    href: "/profile",
    roles: ["provider", "contractor", "advertiser"],
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/settings",
    roles: ["provider", "contractor", "advertiser"],
  },
];
