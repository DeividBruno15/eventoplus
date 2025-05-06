
import { ElementType } from "react";

export type MenuItem = {
  name: string;
  path: string;
  icon: ElementType;
  roles?: string[];
  badge?: number;
  notificationKey?: string;
}

export type SidebarNavigationProps = {
  activePath: string;
  onNavigate: (path: string) => void;
}
